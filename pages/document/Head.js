import NextHead from "next/head";

export function Head() {
    return (
        <NextHead>
            <title>Hello</title>
            <link
                rel="stylesheet"
                href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                crossorigin="anonymous"
            />
            <link rel="stylesheet" href="/static/dashboard.css" />
            <link rel="stylesheet" href="/static/index.css" />
            <link
                rel="shortcut icon"
                href="data:image/x-icon;,"
                type="image/x-icon"
            />
        </NextHead>
    );
}
