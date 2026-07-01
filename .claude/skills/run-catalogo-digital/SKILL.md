---
name: run-catalogo-digital
description: Run, screenshot, and visually verify the FSO digital catalog. Use when asked to start the catalog, take a screenshot, preview catalogo-fso.html, preview admin.html, or check how the app looks.
---

Static HTML/CSS catalog — no server, no build step. Drive it by opening `file://` URLs directly in Chrome headless. There are two pages: the public catalog (`catalogo-fso.html`) and the admin panel (`admin.html`).

All paths below are relative to `catalogo digital/`.

## Prerequisites

Google Chrome must be installed (confirmed at this path):

```
C:\Program Files\Google\Chrome\Application\chrome.exe
```

No other dependencies. The HTML files are self-contained and work offline.

## Build

None. Open the HTML file directly.

## Run (agent path)

Take a screenshot of the public catalog:

```powershell
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$out = "$env:TEMP\catalogo-screenshot.png"
& $chrome --headless=new --disable-gpu --screenshot=$out --window-size=1280,900 `
  "file:///C:/Users/gabri/Desktop/APLICACIONES/catalogo%20digital/catalogo-fso.html"
Start-Sleep -Seconds 3
Write-Output "Screenshot at: $out"
```

Take a screenshot of the admin panel:

```powershell
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$out = "$env:TEMP\admin-screenshot.png"
& $chrome --headless=new --disable-gpu --screenshot=$out --window-size=1280,900 `
  "file:///C:/Users/gabri/Desktop/APLICACIONES/catalogo%20digital/admin.html"
Start-Sleep -Seconds 3
Write-Output "Screenshot at: $out"
```

After running, use the `Read` tool on the output path to view the screenshot image.

## Run (human path)

Double-click `catalogo-fso.html` or `admin.html` — opens in the default browser. No server needed.

## Gotchas

- **Space in folder name** — The folder is named `catalogo digital` (with a space). In the `file://` URL, encode it as `catalogo%20digital`. Without encoding, Chrome silently loads a blank page with no error.
- **`Start-Sleep 3` is required** — Chrome's `--headless=new` exits before finishing the render. Without a short wait the PNG file is created but empty. 3 seconds is reliable on this machine.
- **Screenshot lands in `$env:TEMP`** — which is `C:\Users\gabri\AppData\Local\Temp`. Use an absolute path if you need it elsewhere. Chrome will NOT overwrite a read-only file — delete first if rerunning.
- **Chrome stderr noise** — Chrome prints DevTools and GPU messages to stderr even with `--disable-gpu`. These are harmless; redirect with `2>$null` if they clutter output.
- **`--headless` (old) vs `--headless=new`** — The old flag still works but uses a legacy pipeline that renders some CSS differently. Always use `--headless=new`.

## Troubleshooting

- **Screenshot PNG is black or blank**: Chrome launched but didn't finish rendering. Increase `Start-Sleep` to 5 seconds.
- **Chrome opens a visible window instead of running headlessly**: Missing `--headless=new` flag. Check the command.
- **"The system cannot find the path" error**: Space in folder path not encoded. Use `catalogo%20digital` in the URL.
