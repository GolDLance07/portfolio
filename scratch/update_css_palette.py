import os
import re

CSS_FILES = [
    r"c:\Users\Aarush\Documents\Dev\portfolio\src\styles\constellations.css",
    r"c:\Users\Aarush\Documents\Dev\portfolio\src\styles\archive.css",
    r"c:\Users\Aarush\Documents\Dev\portfolio\src\styles\frontier.css",
    r"c:\Users\Aarush\Documents\Dev\portfolio\src\styles\signal.css",
]

REPLACEMENTS = [
    (r"var\(--color-pink\)", "var(--color-muted-blue)"),
    (r"var\(--color-violet\)", "var(--color-stellar-blue)"),
    (r"rgba\(200,\s*185,\s*240,", "rgba(121, 150, 186,"),
    (r"rgba\(242,\s*169,\s*200,", "rgba(216, 228, 244,"),
]

for file_path in CSS_FILES:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = content
    for pattern, repl in REPLACEMENTS:
        new_content = re.sub(pattern, repl, new_content)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"Updated palette in: {os.path.basename(file_path)}")
