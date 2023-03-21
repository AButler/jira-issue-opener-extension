$ErrorActionPreference = 'Stop'

$solutionDirectory = Split-Path $PSScriptRoot
$srcDirectory = Join-Path $solutionDirectory 'src'
$packageDirectory = Join-Path $solutionDirectory 'packages-build'
$packageFilename = Join-Path $packageDirectory 'jira-issue-opener.zip'

if (!(Test-Path $packageDirectory)) {
  New-Item $packageDirectory -ItemType Directory | Out-Null
}

Write-Host 'Building package...'
if ( Test-Path $packageFilename ) {
  Remove-Item $packageFilename
}

Compress-Archive -Path "$srcDirectory\*" -DestinationPath $packageFilename
Write-Host 'Done!'