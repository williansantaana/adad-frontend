import React from 'react';
import PropTypes from 'prop-types';
import { Table, ButtonGroup, Button } from 'react-bootstrap';
import { FaRegEye, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';

const DataTable = ({ columns, data, onView, onEdit, onDelete, useIcons }) => {
  // Function to validate data based on columns
  const validateData = (row) => {
    return columns.every((col) => col.accessor in row);
  };

  return (
    <Table striped bordered hover responsive className="mt-3">
      <thead>
      <tr>
        {columns.map((column) => (
          <th key={column.accessor}>{column.label}</th>
        ))}
        {(onView || onEdit || onDelete) && <th>Actions</th>}
      </tr>
      </thead>
      <tbody>
      {data.length > 0 ? (
        data.map((row, rowIndex) =>
          validateData(row) ? (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={column.accessor}>{row[column.accessor]}</td>
              ))}
              {(onView || onEdit || onDelete) && (
                <td style={ { width: '0' } }>
                  <div className='d-flex justify-content-between gap-2'>
                    <ButtonGroup>
                      {onView && (
                        <Button variant="outline-primary"
                                title={useIcons ? 'View' : ''}
                                className="d-flex justify-content-center align-items-center"
                                onClick={() => onView(row)}>
                          {useIcons ? <FaRegEye /> : 'View'}
                        </Button>
                      )}
                      {onEdit && (
                        <Button variant="outline-primary"
                                title={useIcons ? 'Edit' : ''}
                                className="d-flex justify-content-center align-items-center"
                                onClick={() => onEdit(row)}>
                          {useIcons ? <FaRegEdit title={'Edit'} /> : 'Edit'}
                        </Button>
                      )}
                      {onDelete && (
                        <Button variant="outline-danger"
                                title={useIcons ? 'Delete' : ''}
                                className="d-flex justify-content-center align-items-center"
                                onClick={() => onDelete(row)}>
                          {useIcons ? <FaRegTrashAlt title={'Delete'} /> : 'Delete'}
                        </Button>
                      )}
                    </ButtonGroup>
                  </div>
                </td>
              )}
            </tr>
          ) : (
            <tr key={rowIndex}>
              <td colSpan={columns.length + 1} className="text-danger">
                Incompatible data format
              </td>
            </tr>
          )
        )
      ) : (
        <tr>
          <td colSpan={columns.length + 1} className="text-center">
            No data available
          </td>
        </tr>
      )}
      </tbody>
    </Table>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  useIcons: PropTypes.bool,
};

DataTable.defaultProps = {
  onView: null,
  onEdit: null,
  onDelete: null,
  useIcons: false,
};

export default DataTable;
