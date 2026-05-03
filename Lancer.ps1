# ╔══════════════════════════════════════════════════════════╗
# ║         Mon Deen au Quotidien — Script de lancement      ║
# ║                    بِسْمِ اللَّهِ                          ║
# ╚══════════════════════════════════════════════════════════╝

param(
    [switch]$Build,
    [switch]$Dev,
    [switch]$Install
)

$AppName = "Mon Deen au Quotidien"
$FolderName = "mon-deen"

Write-Host ""
Write-Host "  بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ" -ForegroundColor Yellow
Write-Host "  $AppName" -ForegroundColor Cyan
Write-Host ""

# ── 1. Vérification Node.js ──────────────────────────────────
Write-Host "[1/4] Vérification de Node.js..." -ForegroundColor DarkGray

$nodeVersion = $null
try {
    $nodeVersion = (node --version 2>$null)
} catch {}

if (-not $nodeVersion) {
    Write-Host "  ✗ Node.js non trouvé !" -ForegroundColor Red
    Write-Host "  → Télécharge Node.js sur https://nodejs.org (version 18 ou +)" -ForegroundColor Yellow
    Write-Host ""
    $open = Read-Host "  Ouvrir la page de téléchargement ? (O/N)"
    if ($open -eq "O" -or $open -eq "o") {
        Start-Process "https://nodejs.org"
    }
    exit 1
}

Write-Host "  ✓ Node.js $nodeVersion détecté" -ForegroundColor Green

# ── 2. Navigation vers le dossier ────────────────────────────
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$appDir = Join-Path $scriptDir $FolderName

# Si on lance depuis la racine où se trouve déjà package.json
if (Test-Path (Join-Path $scriptDir "package.json")) {
    $appDir = $scriptDir
}

if (-not (Test-Path $appDir)) {
    Write-Host "  ✗ Dossier '$FolderName' introuvable." -ForegroundColor Red
    Write-Host "  → Place ce script dans le même dossier que le projet." -ForegroundColor Yellow
    exit 1
}

Set-Location $appDir
Write-Host "  ✓ Dossier trouvé : $appDir" -ForegroundColor Green

# ── 3. Installation des dépendances ──────────────────────────
Write-Host ""
Write-Host "[2/4] Vérification des dépendances..." -ForegroundColor DarkGray

if (-not (Test-Path (Join-Path $appDir "node_modules"))) {
    Write-Host "  → Installation en cours (première fois ~30s)..." -ForegroundColor Yellow
    npm install --silent
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ Échec de l'installation !" -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✓ Dépendances installées" -ForegroundColor Green
} else {
    Write-Host "  ✓ Dépendances déjà présentes" -ForegroundColor Green
}

# ── 4. Lancement ─────────────────────────────────────────────
Write-Host ""
Write-Host "[3/4] Démarrage de l'application..." -ForegroundColor DarkGray
Write-Host ""
Write-Host "  ┌─────────────────────────────────────┐" -ForegroundColor DarkCyan
Write-Host "  │  🌐  http://localhost:3000           │" -ForegroundColor Cyan
Write-Host "  │  📱  Réseau: http://<ton-ip>:3000    │" -ForegroundColor Cyan
Write-Host "  │                                     │" -ForegroundColor DarkCyan
Write-Host "  │  Pour Android : même Wi-Fi requis   │" -ForegroundColor DarkGray
Write-Host "  │  Ctrl+C pour arrêter                │" -ForegroundColor DarkGray
Write-Host "  └─────────────────────────────────────┘" -ForegroundColor DarkCyan
Write-Host ""
Write-Host "  الله أكبر — L'app s'ouvre dans ton navigateur..." -ForegroundColor Yellow
Write-Host ""

# Ouvre le navigateur après 2 secondes
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:3000"
} | Out-Null

# Lance le serveur
npm run dev
