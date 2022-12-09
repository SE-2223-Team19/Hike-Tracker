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
    show
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
            setLoading(false);
            setError(err);
        });
	}, [fetchCall, filters, pagination.currentPage, pagination.pageSize, showInstance]);

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