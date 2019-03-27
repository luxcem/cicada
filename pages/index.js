import React from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";

import Head from "next/head";

import { PageTree } from "./PageTree";

const apiPath = path => `http://localhost:3000${path}`;

export default class Home extends React.Component {
  static async getInitialProps({ query }) {
    const resFT = await axios.get(apiPath("/data"));
    const fileTree = await resFT.data;
    const resC = await axios.get(apiPath(`/data/${query.path}`));
    const content = await resC.data;
    return { fileTree, content };
  }

  render() {
    const { fileTree, content } = this.props;

    return (
      <div>
        <Head>
          <title>Hello</title>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
            integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
            crossorigin="anonymous"
          />
          <link rel="stylesheet" href="/static/index.css" />
        </Head>

        <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
          <h5 className="my-0 mr-md-auto font-weight-normal">Cicada</h5>
          <nav className="my-2 my-md-0 mr-md-3">
            <a className="p-2 text-dark" href="#">
              Something
            </a>
          </nav>
          <a className="btn btn-outline-primary" href="#">
            Some button
          </a>
        </div>
        <div className="container-fluid">
          <div className="row">
            <nav className="col-md-2 d-none d-md-block bg-light sidebar">
              <div className="sidebar-sticky">
                <PageTree fileTree={fileTree} />
              </div>
            </nav>
            <div className="col-md-10">
              <ReactMarkdown source={content} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
