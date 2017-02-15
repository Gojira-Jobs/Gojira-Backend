module.exports = {
    headerchecking: (req, res, next) => {
        if (!req.headers.authheader) res.status(401).send({ 'status': 0, 'err': 'Unauthorized Request' });
        else {
            let header_info = req.headers.authheader;
            header_info = header_info.split('-');
            if (header_info[0] == 'hrportalgojirabackend' && header_info[1] == 'bprrsa@1234') next();
            else res.status(401).send({ 'status': 0, 'err': 'Unauthorized Request' });
        }
    }
}