import { Handler } from "aws-cdk-lib/aws-lambda";
import { LinkChecker } from "linkinator";

export const handler: Handler = async () => {
    const returnData = await checkLinks();

    const response = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(returnData)
    };

    return response;
}

const checkLinks = async () => {
    const checker = new LinkChecker();
    const brokenLinks: {url: string, parent: string|undefined}[] = [];

    checker.on('link', result => {

        if (result.state === 'BROKEN') {
            const newBrokenLink = {
                url: result.url,
                parent: result.parent
            }
            brokenLinks.push(newBrokenLink);
        }
    });

    const result = await checker.check({
        path: 'http://clearviction.org',
        recurse: true,
    });

    const brokenLinksCount = result.links.filter(x => x.state === 'BROKEN');

    return {
        passed: result.passed,
        linksScanned: result.links.length,
        brokenLinksCount: brokenLinksCount.length,
        brokenLinks
    };
};