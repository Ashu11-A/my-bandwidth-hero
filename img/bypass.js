async function bypass(req, res, buffer) {
    res.setHeader('x-proxy-bypass', 1)
    res.setHeader('content-length', buffer.length)
    res.status(200)
    await res.write(buffer)
    res.end()
    // Liberar a memória ocupada pelo buffer
    buffer = null
}

module.exports = { bypass }