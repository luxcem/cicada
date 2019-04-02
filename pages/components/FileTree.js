import { useState } from "react";
import Link from "next/link";

import { FileText, Folder } from "react-feather";

function FolderNode({ name, path, onClick }) {
    return (
        <a className="nav-link-tree" onClick={onClick} href="#">
            <Folder />
            {name}
        </a>
    );
}
function FileNode({ name, path }) {
    return (
        <Link href={`/${encodeURIComponent(path)}`}>
            <a className="nav-link-tree">
                <FileText />
                {name}
            </a>
        </Link>
    );
}

export function FileTree({ fileTree, currentPath, root = false }) {
    const { name, type, path, children } = fileTree;
    const [visible, setVisible] = useState(
        currentPath.startsWith(path) || path == ""
    );
    if (root) {
        return (
            <ul className="file-tree nav flex-column">
                {children &&
                    children.map(child => (
                        <li key={child.path} className="nav-item">
                            {
                                <FileTree
                                    fileTree={child}
                                    currentPath={currentPath}
                                />
                            }
                        </li>
                    ))}
            </ul>
        );
    }
    return (
        <ul className="file-tree nav flex-column">
            <li key={path} className="nav-item">
                {type === "folder" ? (
                    <FolderNode
                        name={name}
                        path={path}
                        onClick={() => setVisible(!visible)}
                    />
                ) : (
                    <FileNode name={name} path={path} />
                )}
                {visible && (
                    <ul>
                        {children &&
                            children.map(child => (
                                <li key={child.path} className="nav-item">
                                    {
                                        <FileTree
                                            fileTree={child}
                                            currentPath={currentPath}
                                        />
                                    }
                                </li>
                            ))}
                    </ul>
                )}
            </li>
        </ul>
    );
}
