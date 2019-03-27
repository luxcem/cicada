import Link from "next/link";

import { FaRegFile, FaRegFolder } from "react-icons/fa";

function TreeNode({ name, path, type }) {
  const Icon = () => (type === "folder" ? <FaRegFolder /> : <FaRegFile />);
  return (
    <Link href={`/page/${encodeURIComponent(path)}`}>
      <a>
        <Icon />
        {name || "."}
      </a>
    </Link>
  );
}

function PageTreeRec({ fileTree }) {
  const { name, type, path, children } = fileTree;
  return (
    <ul>
      <li key={name}>
        <TreeNode name={name} type={type} path={path} />
        <ul>
          {children &&
            children.map(child => (
              <li key={name}>{<PageTreeRec fileTree={child} />}</li>
            ))}
        </ul>
      </li>
    </ul>
  );
}

export function PageTree({ fileTree }) {
  return <ul className="page-tree">{PageTreeRec({ fileTree })}</ul>;
}
