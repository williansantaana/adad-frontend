import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const PaginationComponent = ({ pagination }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (!pagination) {
    return null;
  }

  const { currentPage, totalPages } = pagination;
  const maxVisiblePages = 20;

  const handlePageChange = (page) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', page);
    navigate({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const paginationItems = [];

  // Add "First" and "Previous" buttons
  paginationItems.push(
    <Pagination.First key="first" onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
  );
  paginationItems.push(
    <Pagination.Prev key="prev" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
  );

  // Add pages with ellipsis logic
  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > maxVisiblePages) {
    if (currentPage > 11) {
      startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      if (startPage > 1) {
        paginationItems.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
      }
    }
    endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  }

  for (let page = startPage; page <= endPage; page++) {
    paginationItems.push(
      <Pagination.Item
        key={page}
        active={page === currentPage}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </Pagination.Item>
    );
  }

  if (totalPages > maxVisiblePages && endPage < totalPages) {
    paginationItems.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
  }

  // Add "Next" and "Last" buttons
  paginationItems.push(
    <Pagination.Next key="next" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
  );
  paginationItems.push(
    <Pagination.Last key="last" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
  );

  return <Pagination>{paginationItems}</Pagination>;
};

PaginationComponent.propTypes = {
  pagination: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
  }).isRequired,
};

export default PaginationComponent;