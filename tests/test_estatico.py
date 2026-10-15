"""Verifica o material HTML/CSS sem instalar pacotes ou executar JavaScript."""

from html.parser import HTMLParser
from pathlib import Path
import re
import unittest
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
PAGES = sorted(
    page for page in ROOT.rglob("*.html") if "página principal" not in page.parts
)


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.tags = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


class StaticPagesTest(unittest.TestCase):
    def test_no_executable_javascript(self):
        for page in ROOT.rglob("*.html"):
            with self.subTest(page=page.relative_to(ROOT)):
                document = Document(page.read_text())
                for tag, attrs in document.tags:
                    self.assertNotEqual(tag, "script")
                    self.assertFalse(any(name.lower().startswith("on") for name in attrs))
                    self.assertFalse(attrs.get("href", "").lower().startswith("javascript:"))

    def test_every_page_has_content_and_navigation(self):
        self.assertEqual(len(PAGES), 17)
        for page in PAGES:
            with self.subTest(page=page.relative_to(ROOT)):
                tags = Document(page.read_text()).tags
                for tag in ["h1", "main", "header", "footer"]:
                    self.assertEqual(sum(name == tag for name, _ in tags), 1)
                self.assertTrue(any(name == "nav" for name, _ in tags))
                self.assertTrue(any(attrs.get("id") == "conteudo" for _, attrs in tags))

    def test_local_links_assets_and_anchors_exist(self):
        for page in PAGES:
            for tag, attrs in Document(page.read_text()).tags:
                for attribute in ["href", "src"]:
                    url = attrs.get(attribute)
                    if not url:
                        continue
                    parts = urlsplit(url)
                    with self.subTest(page=page.relative_to(ROOT), url=url):
                        self.assertFalse(parts.scheme or parts.netloc, "Use caminhos locais")
                        self.assertFalse(parts.query, "O detalhe deve abrir sem parâmetros")
                        target = (page.parent / unquote(parts.path)).resolve() if parts.path else page
                        self.assertTrue(target.is_relative_to(ROOT))
                        self.assertTrue(target.is_file())
                        if parts.fragment:
                            ids = {attrs.get("id") for _, attrs in Document(target.read_text()).tags}
                            self.assertIn(unquote(parts.fragment), ids)
                if tag == "img":
                    self.assertIn("alt", attrs)

    def test_css_fonts_exist(self):
        css = ROOT / "shared/base.css"
        for path in re.findall(r'url\(["\']?([^\)"\']+)', css.read_text()):
            self.assertTrue((css.parent / path).is_file(), path)

    def test_dynamic_buttons_stay_disabled(self):
        for page in PAGES:
            for tag, attrs in Document(page.read_text()).tags:
                if tag == "button":
                    with self.subTest(page=page.relative_to(ROOT), button=attrs):
                        self.assertIn("disabled", attrs)

    def test_each_catalog_has_four_products(self):
        for brand in ["store", "wine", "pizzas"]:
            tags = Document((ROOT / brand / "index.html").read_text()).tags
            cards = [attrs for tag, attrs in tags if tag == "article" and attrs.get("class") == "product-card"]
            self.assertEqual(len(cards), 4, brand)

    def test_legacy_files_are_preserved(self):
        self.assertEqual((ROOT / "página principal/app.js").read_text().strip(), "")
        self.assertTrue((ROOT / "página principal/index.html").is_file())


if __name__ == "__main__":
    unittest.main()
