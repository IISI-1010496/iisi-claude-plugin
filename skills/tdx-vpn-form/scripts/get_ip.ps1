param(
    [string]$InterfaceAlias = ""
)

$results = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -notlike '127.*' -and
    $_.IPAddress -notlike '169.254.*' -and
    $_.InterfaceAlias -notlike '*vEthernet*' -and
    $_.InterfaceAlias -notlike '*Docker*'
}

if ($InterfaceAlias) {
    $results = $results | Where-Object { $_.InterfaceAlias -like "*$InterfaceAlias*" }
}

$results | Select-Object -First 1 -ExpandProperty IPAddress
