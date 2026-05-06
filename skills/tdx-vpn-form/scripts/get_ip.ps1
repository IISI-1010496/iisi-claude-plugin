# 偵測非虛擬網卡的 IPv4 地址
Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    $_.IPAddress -notlike '127.*' -and 
    $_.IPAddress -notlike '169.254.*' -and 
    $_.InterfaceAlias -notlike '*vEthernet*' -and 
    $_.InterfaceAlias -notlike '*Docker*' 
} | Select-Object IPAddress, InterfaceAlias | Format-Table -AutoSize
