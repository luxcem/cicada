import { FileTree } from "./FileTree";

export function SideBar(props) {
    return (
        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
            <div className="sidebar-sticky">
                <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                    Data
                </h6>
                <FileTree root {...props} />
            </div>
        </nav>
    );
}
