export const writeJson = (payload: object) => {
    // single line JSON for docker log collectors
    process.stdout.write(JSON.stringify(payload) + "\n");
}
