import glob

tag = (
    "<!-- Google tag (gtag.js) -->\n"
    '<script async src="https://www.googletagmanager.com/gtag/js?id=G-RK0NNFE5HC"></script>\n'
    "<script>\n"
    "  window.dataLayer = window.dataLayer || [];\n"
    "  function gtag(){dataLayer.push(arguments);}\n"
    "  gtag('js', new Date());\n"
    "  gtag('config', 'G-RK0NNFE5HC');\n"
    "</script>\n"
)

for f in glob.glob("*.html"):
    content = open(f, encoding="utf-8").read()
    if "G-RK0NNFE5HC" not in content and "</head>" in content:
        content = content.replace("</head>", tag + "</head>", 1)
        open(f, "w", encoding="utf-8").write(content)
        print("Done: " + f)
    else:
        print("Skipped: " + f)
