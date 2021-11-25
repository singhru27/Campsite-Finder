function wrapAsync(func) {
    return (req, res, next) => {
        return func(req, res, next).catch(next);
    }
}

module.exports = wrapAsync;