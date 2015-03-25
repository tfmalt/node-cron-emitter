module.exports = function () {
    console.log(process.cwd());
    return {
        files: [
            "package.json",
            "lib/*.js"
        ],

        tests: [
            "test/*Test.js"
        ],

        env: {
            type: "node",
            runner: "/usr/local/bin/node",
            params: {
                env: "TZ=Europe/Oslo"
            }
        },

        workers: {
            recycle: false
        }
    }
};