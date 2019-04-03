import MarkdownIt from "markdown-it";
import MarkdownItMeta from "markdown-it-meta";
import MarkdownItLatex from "markdown-it-latex";
import Plugin from "markdown-it-regexp";

import { highlight, getLanguage } from "highlightjs";
import "highlightjs/styles/github.css";
import "markdown-it-latex/dist/index.css";

export function CicadaMD({ content }) {
    const options = {
        linkify: true,
        highlight: function(str, lang) {
            if (lang && getLanguage(lang)) {
                try {
                    return highlight(lang, str).value;
                } catch (__) {}
            }

            return ""; // use external default escaping
        },
    };
    const md = new MarkdownIt(options);
    md.use(MarkdownItMeta);
    md.use(MarkdownItLatex);
    const html = md.render(content);

    return (
        <div>
            <div className="border-bottom pb-2 mb-2">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
                    <h1 className="h2">{md.meta.title}</h1>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="btn-group mr-2">
                            <button className="btn btn-sm btn-outline-secondary">
                                Edit
                            </button>
                            <button className="btn btn-sm btn-outline-secondary">
                                Link
                            </button>
                        </div>
                    </div>
                </div>
                {md.meta.date && (
                    <small className="text-muted">{md.meta.date}</small>
                )}
            </div>
            <div className="markdown">
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </div>
    );
}
