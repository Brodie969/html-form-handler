const form = document.getElementById('login');
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the form from submitting normally
    const username = document.getElementById('name').value;
    const key = document.getElementById('key').value;
    pass = hash(key);
    alert(`Name: ${username}\nAccess Key: ${key}\nHashed Key: ${pass}`);
});

function hash(message) {
    let h0 = 0x67452301;
    let h1 = 0xEFCDAB89;
    let h2 = 0x98BADCFE;
    let h3 = 0x10325476;
    let h4 = 0xC3D2E1F0;

    // Pre-processing
    let ml = message.length * 8; // Message length in bits
    message += String.fromCharCode(0x80); // Append '1' bit
    while ((message.length * 8) % 512 !== 448) {
        message += String.fromCharCode(0x00); // Append '0' bits
    }
    // Append the original message length as a 64-bit big-endian integer
    message += String.fromCharCode((ml >>> 56) & 0xFF, (ml >>> 48) & 0xFF, (ml >>> 40) & 0xFF, (ml >>> 32) & 0xFF, (ml >>> 24) & 0xFF, (ml >>> 16) & 0xFF, (ml >>> 8) & 0xFF, ml & 0xFF);

    // Process the message in 512-bit chunks
    for (let i = 0; i < message.length; i += 64) {
        const chunk = message.substring(i, i + 64);

        // Break chunk into sixteen 32-bit big-endian words
        const w = new Array(80);
        for (let j = 0; j < 16; j++) {
            w[j] = (chunk.charCodeAt(j * 4) << 24) | (chunk.charCodeAt(j * 4 + 1) << 16) | (chunk.charCodeAt(j * 4 + 2) << 8) | chunk.charCodeAt(j * 4 + 3);
        }

        // Message schedule
        for (let j = 16; j < 80; j++) {
            w[j] = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
            w[j] = (w[j] << 1) | (w[j] >>> 31);
        }

        // Initialize hash values
        let a = h0;
        let b = h1;
        let c = h2;
        let d = h3;
        let e = h4;

        // Main loop
        for (let j = 0; j < 80; j++) {
            let f, k;
            if (j < 20) {
                f = (b & c) | (~b & d);
                k = 0x5A827999;
            } else if (j < 40) {
                f = b ^ c ^ d;
                k = 0x6ED9EBA1;
            } else if (j < 60) {
                f = (b & c) | (b & d) | (c & d);
                k = 0x8F1BBCDC;
            } else {
                f = b ^ c ^ d;
                k = 0xCA62C1D6;
            }

            const temp = ((a << 5) | (a >>> 27)) + f + e + k + w[j];
            e = d;
            d = c;
            c = (b << 30) | (b >>> 2);
            b = a;
            a = temp;
        }

        // Update hash values for this chunk
        h0 += a;
        h1 += b;
        h2 += c;
        h3 += d;
        h4 += e;
    }

    // Produce the final hash value (big-endian) as a 160-bit number
    let hh = (h0 << 128) | (h1 << 96) | (h2 << 64) | (h3 << 32) | h4;
    hh += h0;
    hh += h1;
    hh += h2;
    hh += h3;
    hh += h4;
    return hh;
}
