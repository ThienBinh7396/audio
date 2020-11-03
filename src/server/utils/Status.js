class Status {
    getStatus(type, message, content) {
        return {
            type,
            message,
            data: content
        }
    }

}

module.exports = new Status();