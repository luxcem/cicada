import React from "react";
import axios from "axios";

import { Head } from "./document";
import { SideBar, NavBar } from "./components";
import { CicadaMD } from "../tools/CicacdaMD";

const apiPath = path => `http://localhost:3000${path}`;

export default class Home extends React.Component {
    static getInitialProps({ query }) {
        return axios
            .all([
                axios.get(apiPath("/data")),
                axios.get(apiPath(`/data/${query.path}`)),
            ])
            .then(
                axios.spread((fileTree, content) => {
                    return {
                        content: content.data,
                        fileTree: fileTree.data,
                        path: query.path,
                    };
                })
            );
    }

    render() {
        const { content, fileTree, path } = this.props;
        return (
            <div>
                <Head />
                <NavBar />
                <div className="container-fluid">
                    <div className="row">
                        <SideBar fileTree={fileTree} currentPath={path} />
                        <main
                            role="main"
                            className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4"
                        >
                            <CicadaMD content={content} />
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}
