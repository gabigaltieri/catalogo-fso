<#
.SYNOPSIS
  Driver for the FSO catálogo digital static site (catalogo-fso.html + admin.html).

.DESCRIPTION
  No server, no build — these are self-contained file:// pages. This script
  wraps headless Chrome so an agent can (a) screenshot either page and
  (b) prove the one real piece of behavior this app has: that products
  saved in admin.html's localStorage show up in catalogo-fso.html.

.PARAMETER Action
  screenshot   Take a screenshot of -Page. Default action.
  verify-sync  Inject a test product into localStorage (the same keys
               admin.html's save() writes) using an isolated Chrome profile,
               then screenshot the catalog to prove it renders the change.

.PARAMETER Page
  catalogo-fso.html (default) or admin.html. Only used by -Action screenshot.

.PARAMETER Out
  Output PNG path. Defaults under $env:TEMP.

.EXAMPLE
  .\driver.ps1 -Action screenshot -Page catalogo-fso.html
.EXAMPLE
  .\driver.ps1 -Action screenshot -Page admin.html
.EXAMPLE
  .\driver.ps1 -Action verify-sync
#>
param(
    [ValidateSet('screenshot', 'verify-sync')]
    [string]$Action = 'screenshot',

    [ValidateSet('catalogo-fso.html', 'admin.html')]
    [string]$Page = 'catalogo-fso.html',

    [string]$Out
)

$ErrorActionPreference = 'Stop'

$chrome  = "C:\Program Files\Google\Chrome\Application\chrome.exe"
# Skill dir -> project root is two levels up (.claude\skills\run-catalogo-digital -> project root)
$projectDir = (Resolve-Path (Join-Path $PSScriptRoot "..\..\..")).Path
$encodedDir = $projectDir -replace '\\', '/' -replace ' ', '%20'
$encodedDir = "/" + ($encodedDir -replace '^([A-Za-z]):', '$1:')

function Take-Screenshot {
    param([string]$PageFile, [string]$OutPath, [string]$Profile)

    if (Test-Path $OutPath) { Remove-Item $OutPath -Force }
    $url = "file://$encodedDir/$PageFile"

    $profileArgs = @()
    if ($Profile) { $profileArgs = @("--user-data-dir=$Profile") }

    & $chrome --headless=new --disable-gpu @profileArgs `
        --screenshot=$OutPath --window-size=1280,1400 $url 2>$null
    Start-Sleep -Seconds 3

    if (-not (Test-Path $OutPath)) {
        throw "Screenshot was not created at $OutPath - Chrome likely failed to launch or render."
    }
    Write-Output "Screenshot at: $OutPath"
}

switch ($Action) {

    'screenshot' {
        if (-not $Out) { $Out = "$env:TEMP\$($Page -replace '\.html$','')-screenshot.png" }
        Take-Screenshot -PageFile $Page -OutPath $Out
    }

    'verify-sync' {
        # Isolated profile so this never touches the user's real Chrome data.
        $profile = "$env:TEMP\fso_verify_sync_profile"
        Remove-Item -Recurse -Force $profile -ErrorAction SilentlyContinue

        # 1) Load admin.html once so its load()/save() populate the default
        #    catalog into localStorage (fso_cat / fso_subcat / fso_prod).
        & $chrome --headless=new --disable-gpu --user-data-dir=$profile `
            "file://$encodedDir/admin.html" --virtual-time-budget=2000 2>$null
        Start-Sleep -Seconds 2

        # 2) Inject a distinctive test product using the exact same
        #    localStorage keys/shape admin.html writes — simulates what
        #    "Agregar Producto" does, without needing UI automation.
        $injectPath = "$env:TEMP\__fso_driver_inject.html"
        @'
<!DOCTYPE html><html><body>
<script>
const prods = JSON.parse(localStorage.getItem('fso_prod'));
prods.push({ id: 999999, subcatId: 1, cod: "DRV", name: "DRIVER SYNC CHECK", pres: "1 u", desc: "Injected by driver.ps1 verify-sync." });
localStorage.setItem('fso_prod', JSON.stringify(prods));
document.title = 'INJECT_DONE';
</script>
</body></html>
'@ | Set-Content -Path $injectPath -Encoding utf8

        & $chrome --headless=new --disable-gpu --user-data-dir=$profile `
            "file:///$($injectPath -replace '\\','/' -replace ' ','%20')" --virtual-time-budget=2000 2>$null
        Start-Sleep -Seconds 2
        Remove-Item $injectPath -Force -ErrorAction SilentlyContinue

        # 3) Screenshot the catalog — DRIVER SYNC CHECK / DRV should be
        #    visible in the Lavandinas table if the sync works.
        if (-not $Out) { $Out = "$env:TEMP\catalogo-verify-sync.png" }
        Take-Screenshot -PageFile 'catalogo-fso.html' -OutPath $Out -Profile $profile

        Remove-Item -Recurse -Force $profile -ErrorAction SilentlyContinue
        Write-Output "Look for a row with code 'DRV' / name 'DRIVER SYNC CHECK' under Lavandinas to confirm sync."
    }
}
