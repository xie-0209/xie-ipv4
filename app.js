document.getElementById('calculateBtn').addEventListener('click', function() {
    const ip = document.getElementById('ipAddress').value;
    const cidr = document.getElementById('subnetMask').value;
    
    if (isValidIP(ip) && isValidCIDR(cidr)) {
        const subnetInfo = calculateSubnet(ip, parseInt(cidr.slice(1)));
        showResults(subnetInfo);
    } else {
        alert("請輸入有效的 IPv4 地址和子網掩碼！");
    }
});

function isValidIP(ip) {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
}

function isValidCIDR(cidr) {
    return /^\/(3[0-2]|[12]?[0-9])$/.test(cidr);
}

function calculateSubnet(ip, cidr) {
    const ipParts = ip.split('.').map(num => parseInt(num));
    const mask = getSubnetMask(cidr);
    const network = getNetwork(ipParts, mask);
    const broadcast = getBroadcast(network, mask);
    const usableIPs = getUsableIPs(network, mask);

    return {
        subnetMask: mask.join('.'),
        networkRange: `${network[0]}.${network[1]}.${network[2]}.${network[3]} - ${broadcast[0]}.${broadcast[1]}.${broadcast[2]}.${broadcast[3]}`,
        availableRange: `${usableIPs.start} - ${usableIPs.end}`,
        networkName: `網段名稱: ${ip}`,
        broadcast: `${broadcast[0]}.${broadcast[1]}.${broadcast[2]}.${broadcast[3]}`
    };
}

function getSubnetMask(cidr) {
    const mask = [];
    for (let i = 0; i < 4; i++) {
        if (cidr >= 8) {
            mask.push(255);
            cidr -= 8;
        } else if (cidr > 0) {
            mask.push(256 - Math.pow(2, 8 - cidr));
            cidr = 0;
        } else {
            mask.push(0);
        }
    }
    return mask;
}

function getNetwork(ip, mask) {
    return ip.map((val, index) => val & mask[index]);
}

function getBroadcast(network, mask) {
    return network.map((val, index) => val | (255 - mask[index]));
}

function getUsableIPs(network, mask) {
    const start = [...network];
    const end = [...network];
    start[3] += 1;
    end[3] = end[3] === 255 ? 254 : end[3] - 1;
    return { start: start.join('.'), end: end.join('.') };
}

function showResults(subnetInfo) {
    document.getElementById('subnetMaskResult').textContent = subnetInfo.subnetMask;
    document.getElementById('networkRangeResult').textContent = subnetInfo.networkRange;
    document.getElementById('availableRangeResult').textContent = subnetInfo.availableRange;
    document.getElementById('networkNameResult').textContent = subnetInfo.networkName;
    document.getElementById('broadcastResult').textContent = subnetInfo.broadcast;

    document.getElementById('result').style.display = 'block';
}
