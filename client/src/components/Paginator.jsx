import { React, useEffect } from "react";
import { Row, Col, Pagination, Form } from "react-bootstrap";
import "./Paginator.css";

const PAGE_TILES = 5;

/**
 * 
 * @param {currentPage: Number; totalPages: Number; pageSize: Number; setPage: (arg0: Number) => void; setPageSize(arg0: Number) => void}} arg0 
 * @returns 
 */
function Paginator({currentPage, totalPages, pageSize, setPage, setPageSize}) {

    useEffect(() => {
      if (currentPage > totalPages && totalPages > 0) {
        setPage(1);
      }
    }, [currentPage, totalPages, setPage]);
    

    return (
        <Row className="mt-3">
            <Col>
                <Pagination className="d-flex justify-content-center">
                    <li className="page-item">
                        <Form.Select
                            value={pageSize}
                            onChange={(e) => setPageSize(e.target.value)}>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </Form.Select>
                    </li>
                    <Pagination.First onClick={() => setPage(1)} style={{color: "#198754"}}></Pagination.First>
                    <Pagination.Prev onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1}></Pagination.Prev>
                    {
                        PAGE_TILES < totalPages && 
                        <Pagination.Ellipsis></Pagination.Ellipsis>
                    }

                    {
                        Array.from({length: totalPages}, (_, i) => i + 1)
                        .filter(page => page <= totalPages && page >= 1)
                        .filter(page => (currentPage === totalPages && page > currentPage - PAGE_TILES) || (currentPage === 1 && page <= PAGE_TILES) || (page >= currentPage - PAGE_TILES / 2 && page <= currentPage + PAGE_TILES / 2))
                        .map(page => <Pagination.Item key={page} active={page === currentPage} onClick={() => setPage(page)}>{page}</Pagination.Item>)
                    }

                    {
                        PAGE_TILES < totalPages && 
                        <Pagination.Ellipsis></Pagination.Ellipsis>
                    }   
                    <Pagination.Next onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages}></Pagination.Next>
                    <Pagination.Last onClick={() => setPage(totalPages)}></Pagination.Last>
                </Pagination>
            </Col>
        </Row>
    );
}

export default Paginator;