import { Handler } from "aws-cdk-lib/aws-lambda";
import { LinkChecker } from "linkinator";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const SES_EMAIL_FROM = 'elenipapanicolas@gmail.com';
const SES_EMAIL_TO = 'eleni.papanicolas@proton.me';

interface LinkData {
    passed: boolean;
    linksScanned: number;
    brokenLinksCount: number;
    brokenLinks: {
        url: string;
        parent?: string;
    }[];
}

export const handler: Handler = async () => {
    try {
        const returnData: LinkData = await checkLinks();
    
        if (!returnData.passed) {
            return await sendEmail(returnData);
        }
    
        return;
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ message: 'An error occurred while scanning the links', error })
        }
    }
}

const checkLinks = async () => {
    const checker = new LinkChecker();
    const brokenLinks: LinkData["brokenLinks"] = [];

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

const sendEmail = async (data: LinkData) => {
    const ses = new SESv2Client({region: 'us-east-1'});
    const scanDate = new Date().toLocaleString();

    const input = sendEmailParams(data, scanDate);
    const sendEmailCommand = new SendEmailCommand(input);
    return await ses.send(sendEmailCommand);
}

const sendEmailParams = ({passed, linksScanned, brokenLinksCount, brokenLinks}: LinkData, scanDate: string) => {
    return {
        FromEmailAddress: SES_EMAIL_FROM,
        Destination: {
            ToAddresses: [SES_EMAIL_TO],
        },
        Content: {
            Simple: {
                Subject: {
                    Charset: 'UTF-8',
                    Data: `Linkinator Report: ${scanDate}`,
                },
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: getHtmlContent({passed, linksScanned, brokenLinksCount, brokenLinks}),
                    },
                },
            }
        }
    };
}

const getHtmlContent = ({passed, linksScanned, brokenLinksCount, brokenLinks}: LinkData) => {
    return `
        <html>
            <body>
                <h1>Linkinator scan results 👀</h1>
                <ul>
                    <li style="font-size:18px">Passed: <b>${passed}</b></li>
                    <li style="font-size:18px">Links scanned: <b>${linksScanned}</b></li>
                    <li style="font-size:18px">Broken links found: <b>${brokenLinksCount}</b></li>
                </ul>
                <h2>Broken links:</h2>
                ${mapBrokenLinks(brokenLinks)}
            </body>
        </html>
    `;
}

const mapBrokenLinks = (brokenLinks: LinkData["brokenLinks"]) => {
    return brokenLinks.map(link => {
        return `<div>
                    <p style="font-size:14px"><b>Broken link url:</b> <a href="${link.url}">${link.url}</a></p>
                    <p style="font-size:14px">Found on CV website page: <a href="${link.parent}">${link.parent}</a></p>
                </div>`
    });
}