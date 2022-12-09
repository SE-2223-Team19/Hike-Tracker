import { React, useState, useEffect } from "react";
import Paginator from "./Paginator"

/**
 * 
 * @param {{
 *  fetchCall: (arg0: Object) => Promise<{data: [any]; metadata: [any]}>; 
 *  dataElement: (any) => JSX.Element;
 *  loadingElement: (any) => JSX.Element;
 *  noDataElement: (any) => JSX.Element;
 *  errorElement: (any) => JSX.Element;
 *  dataContainer: ({children: any}) => JSX.Element;
 *  filters: Object
 *  dirty: Boolean,
 *  setDirty: (arg0: Boolean) => void
 * }} param0 
 * @returns 
 */
function PaginatedList({ 
    fetchCall, 
    dataElement: DataElement, 
    loadingElement: LoadingElement, 
    noDataElement: NoDataElement, 
    errorElement: ErrorElement,
    dataContainer: DataContainer = ({children}) => <>{children}</>,
    filters,
<<<<<<< HEAD
    show
=======
    dirty = null,
    setDirty = null
>>>>>>> origin/development
}) {
    
    const [data, setData] = useState(null);
	const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, pageSize: 25 });
	const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let showInstance = show ? "" :  undefined

    useEffect(() => {
		setLoading(true);
        fetchCall({
            ...filters,
            page: pagination.currentPage,
            pageSize: pagination.pageSize,
        }).then(data => {
            console.log(data);
            if (setDirty) setDirty(false);
            if (data.error) {
				setData(null);
				setLoading(false);
                setError(data.error);
				return;
			}
			setData(data.data);
			setPagination(
				(old) =>
					data.metadata.find((m) => m.type === "pagination") || {
						...old,
						currentPage: 1,
						totalPages: 0,
					}
			);
			setLoading(false);
            setError(null);
        })
        .catch(err => {
            if (setDirty) setDirty(false);
            setLoading(false);
            setError(err);
        });
<<<<<<< HEAD
	}, [fetchCall, filters, pagination.currentPage, pagination.pageSize, showInstance]);
=======
	}, [fetchCall, filters, pagination.currentPage, pagination.pageSize, dirty, setDirty]);
>>>>>>> origin/development

    return (
        <>
            {
                loading && 
                <LoadingElement />
            }
            {
                data && data.length === 0 && !loading && 
                <NoDataElement message={"No hikes found."} />
            }
            {
                error && !loading && 
                <ErrorElement message={"Something went wrong during the request. Try again later."} />
            }
            {
                data && data.length > 0 && !loading &&
                <DataContainer>
                    {
                        data.map(DataElement)
                    }
                </DataContainer>
            }
            {
                data && data.length > 0 && !loading &&
                <Paginator
                    setPage={(page) => setPagination({ ...pagination, currentPage: page })}
                    setPageSize={(pageSize) => setPagination({ ...pagination, pageSize: pageSize })}
                    {...pagination}
                />
            }
        </>
    );
}

export default PaginatedList;