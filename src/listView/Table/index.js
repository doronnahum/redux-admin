import React from 'react';
import { Table, Input, Icon, Dropdown, Menu, Pagination } from 'antd';
import Filters from '../../filters';
import uniq from 'lodash/uniq';
import {getMinTableWidth} from './helpers';
import PropTypes from 'prop-types'
import FilterColumns from './FilterColumns'

const Search = Input.Search;
class ReTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAdvanceFiltersOptions: false,
      showFilterColumns: false,
      columnsFilters: null
    };
    this.sortKey = null
    this.sortOrder = null;
  };

  handleChange = (pagination, filters, sorter) => {
    if(sorter.columnKey === 'action') return
    const newSortKey = sorter.columnKey || sorter.field;
    const newSortOrder = sorter.order;
    if(this.sortKey !== newSortKey || this.sortOrder !== newSortOrder) {
      this.sortKey = newSortKey;
      this.sortOrder = newSortOrder;
      this.props.onSortChange({[newSortKey]: newSortOrder === 'descend' ? -1 : 1})
    }
  };

  onShowFilterColumns = () => {
    this.setState({showFilterColumns: true})
  }
  onFilterColumnsConfirm = (columnsFilters) => {
    this.setState({showFilterColumns: false, columnsFilters})
  }
  onFilterColumnsReset = () => {
    this.setState({columnsFilters: []})
  }
  onFilterColumnsClose = () => {
    this.setState({showFilterColumns: false})
  }

  getActions() {
    const { editable, canRead, canUpdate, canDelete, renderInsideRowActions, onEditClick, onDeleteClick, onViewDocClick } = this.props;
    const canView = onViewDocClick && canRead
    if (!editable || (!canUpdate && !canDelete && !(canView) && !renderInsideRowActions)) return [];
    return [
      {
        key: 'action',
        width: (!!canView + !!canUpdate + !!canDelete) * 33,
        render: (text, record) => (
          <span className='ra-table-action-btns'>
            {!!(canView) && (
              <a
                href="javascript:;"
                className="padding5 ra-marginRight5"
                onClick={() => onViewDocClick(record)}
              >
                <Icon type="eye" theme="outlined" />
              </a>
            )}
            {!!canUpdate && (
              <a
                href="javascript:;"
                className="padding5 ra-marginRight5"
                onClick={() => onEditClick(record)}
              >
                <Icon type="edit" theme="outlined" />
              </a>
            )}
            {!!canDelete && (
              <a
                href="javascript:;"
                className="padding5"
                onClick={() => onDeleteClick(record)}
              >
                <Icon type="delete" theme="outlined" />
              </a>
            )}
            {/* <Divider type="vertical" />
            <a href="javascript:;">Delete</a> */}
            {!!renderInsideRowActions &&
              renderInsideRowActions(record)}
          </span>
        )
      }
    ];
  }
  getCurrentPage = () => {
    const { skip, limit } = this.props;
    if (!skip) return 1;
    const newLimit = Math.floor((skip / limit) + 1);
    return newLimit > 1 ? newLimit : 1;
  };

  getFilterFields = (columns) => {
    const {getFilterFields, filtersFields} = this.props
    if(getFilterFields) return getFilterFields(this.props)
    const filterFields = []
    columns.map(item => {
      const _filtersField = filtersFields && filtersFields.find(filtersField => filtersField.key === (item.key || item.dataIndex))
      if(!filtersFields || _filtersField) {
        filterFields.push({
          key: item.key || item.dataIndex,
          title: item.title,
          type: item.type || String,
          // getData: () => {
          //   return uniq(this.props.data.map(value => value[item.key || item.dataIndex]))
          // },
          options: _filtersField ? _filtersField.options : null
        })
      }
    })
    return filterFields
  }
  hideAdvanceOptions = () => {
    this.setState({showAdvanceFiltersOptions: false})
  }
  showAdvanceOptions = () => {
    this.setState({showAdvanceFiltersOptions: true})
  }

  columnsToRender = () => {
    const {
      getColumns,
      allowColumnFilters
    } = this.props;

    this.columns = getColumns(this.props)
    this.columnsFiltersMenu = allowColumnFilters ? (this.columnsFiltersMenu || this.columns.map(field => ({title: field.title, key: field.key || field.dataIndex}))) : null
    if(!this.state.columnsFilters || !this.state.columnsFilters.length) {
      return [...this.columns, ...this.getActions()];
    }else{
      return [...this.columns.filter(field => {
        return this.state.columnsFilters.includes(field.key || field.dataIndex)
      }), ...this.getActions()]
    }
  }

  onDownloadExcel = () => {
    const {data, onDownloadExcel} = this.props;
    if(onDownloadExcel) {
      onDownloadExcel({
        data,
        columns: this.columns,
        columnsToDisplay: this.state.columnsFilters,
        columnsFilters: this.state.columnsFilters
      })
    }
  }
  onDownloadPdf = () => {
    const {data, onDownloadPdf} = this.props;
    if(onDownloadPdf) {
      onDownloadPdf({
        data,
        columns: this.columns,
        columnsToDisplay: this.state.columnsFilters
      })
    }
  }
  renderMenu = () => {
    const {
      onNewClick,
      onRefreshClick,
      allowAdvanceFilters,
      allowFilters,
      allowColumnFilters,
      onDownloadExcel,
      onDownloadPdf,
      canCreate
    } = this.props;
    const overlay = <Menu>
      <Menu.Item key="1" onClick={onRefreshClick}><Icon type="reload" />Reload</Menu.Item>
      {(allowAdvanceFilters && allowFilters) && <Menu.Item key="2" onClick={this.showAdvanceOptions}><Icon type="filter" />Advanced Filter</Menu.Item>}
      {allowColumnFilters && <Menu.Item key="3" onClick={this.onShowFilterColumns}><Icon type="table" />Columns</Menu.Item>}
      {onDownloadPdf && <Menu.Item key="4" onClick={this.onDownloadPdf}><Icon type="file-pdf" />Pdf</Menu.Item>}
      {onDownloadExcel && <Menu.Item key="5" onClick={this.onDownloadExcel}><Icon type="file-excel" />Xsl</Menu.Item>}
    </Menu>
    if(canCreate) {
      return <Dropdown.Button
        placement='bottomLeft'
        onClick={onNewClick}
        overlay={overlay}
      >
      New
      </Dropdown.Button>
    }else{
      return (
        <Dropdown overlay={overlay}>
          <Icon type="setting" />
        </Dropdown>
      )
    }
  }
  render() {
    const {
      getColumns,
      data,
      onRow,
      rowKey,
      searchValue,
      onSearch,
      onSearchValueChange,
      locale,
      showSearchField,
      onFiltersChanged,
      allowFilters,
      loading,
      allowColumnFilters,
      showHeaders,
      expandedRowRender,
      renderHeaders
      // allowAdvanceFilters,
      // onNewClick,
      // onRefreshClick,
      // enabledNew,
      // onDownloadExcel,
      // onDownloadPdf,
      // canCreate
    } = this.props;
    if (!getColumns) return 'Table missing getColumns';
    const columns = this.columnsToRender()
    const minWidth = getMinTableWidth(columns)
    const paginationProps = {
      total: this.props.count,
      pageSize: this.props.limit,
      current: this.getCurrentPage(),
      pageSizeOptions: [
        '5',
        '10',
        '15',
        '20',
        '25',
        '30',
        '40',
        '50',
        '60',
        '100'
      ],
      size: 'small',
      onChange: this.props.onPageChange,
      onShowSizeChange: this.props.onPageSizeChange,
      showSizeChanger: true,
      showTotal: (total, [from, to]) => {
        if(total > 0) return `Showing ${from} to ${to} of ${total} entries`
        return ''
      }
    }
    return (
      <div className="ra-tableWrapper">
        {renderHeaders && renderHeaders(this.props)}
        {showHeaders &&
          <div className="ra-tableHeader">
            <div className="ra-tableHeader-row">
              <div className="ra-tableHeader-left">
                {allowFilters &&
                  <Filters
                    fields={this.getFilterFields(this.columns)}
                    onFiltersChanged={onFiltersChanged}
                    hideAdvanceOptions={this.hideAdvanceOptions}
                    showAdvanceOptions={this.state.showAdvanceFiltersOptions}
                  />
                }
                {showSearchField && <Search
                  placeholder="input search text"
                  onSearch={onSearch}
                  onChange={onSearchValueChange}
                  value={searchValue}
                  style={{ width: 200 }}
                />}
              </div>
              <div className="ra-tableHeaderActions">
                {this.renderMenu()}
              </div>
            </div>
          </div>
        }
        <div className="ra-tableContent">
          <div className='ra-tableContent-table'>
            <div style={{minWidth: minWidth + 20}}>
              <Table
                scroll={{ y: 240, x: minWidth }}
                columns={columns}
                dataSource={data}
                onChange={this.handleChange}
                onRow={onRow}
                rowKey={rowKey}
                locale={locale}
                pagination={false}
                loading={loading}
                expandedRowRender={expandedRowRender}
              />
            </div>
          </div>
          <div className='ra-tableContent-pagination'>
            <Pagination {...paginationProps}/>
          </div>
          {(allowColumnFilters && this.columns) &&
          <FilterColumns
            visible={this.state.showFilterColumns}
            onOk={this.onFilterColumnsConfirm}
            onReset={this.onFilterColumnsReset}
            onClose={this.onFilterColumnsClose}
            fields={this.columnsFiltersMenu}
            columnsFilters={this.state.columnsFilters}
          />
          }
        </div>
      </div>
    );
  }
}

ReTable.defaultProps = {
  rowKey: '_id',
  data: [],
  locale: null, // ant table locale
  getColumns: () => {
    // eslint-disable-next-line no-console
    console.wanr('Missing getColumns');
    return [];
  },
  editable: true,
  allowFilters: true,
  enabledNew: true,
  renderTable: null,
  renderInsideRowActions: null, // Pass A function if you want to add something inside the action column
  canDelete: true,
  canUpdate: true,
  showSearchField: false,
  allowAdvanceFilters: true,
  getFilterFields: null, // function that will return [{value: 'title', label: 'Title', type: String}, {value: 'age', label: 'Age', , type: Number}]
  allowColumnFilters: true,
  showHeaders: true,
  expandedRowRender: null,
  renderHeaders: null,
};

ReTable.propTypes = {
  data: PropTypes.array,
  getColumns: PropTypes.func.isRequired, // getColumns(this.props) -> [{value: 'title', label: 'Title', type: String, render: () => 'OPTIONAL'}]
  getFilterFields: PropTypes.func, // if empty then we use getColumns
  rowKey: PropTypes.string,
  editable: PropTypes.bool,
  canUpdate: PropTypes.bool,
  canDelete: PropTypes.bool,
  renderInsideRowActions: PropTypes.func, // renderInsideRowActions(cell, row) => <button>Delete</button>
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  skip: PropTypes.number,
  limit: PropTypes.number,
  onRow: PropTypes.func,
  onNewClick: PropTypes.func,
  onRefreshClick: PropTypes.func,
  enabledNew: PropTypes.bool,
  searchValue: PropTypes.string,
  showSearchField: PropTypes.bool,
  onSearch: PropTypes.func,
  onSearchValueChange: PropTypes.func,
  onFiltersChanged: PropTypes.func,
  allowAdvanceFilters: PropTypes.bool,
  allowFilters: PropTypes.bool,
  loading: PropTypes.bool,
  count: PropTypes.number,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  onViewDocClick: PropTypes.func,
  showColumnFilters: PropTypes.bool,
  filtersFields: PropTypes.array, // when empty all table fields ar filters fields, pass array of fieldKeys to allow only some of them , Example [{key: 'status', options: {value: 'ctr', label: 'Create'}}]
  allowExportToExcel: PropTypes.bool, // true by default,
  onDownloadExcel: PropTypes.func, // to override local export pass function to handle this ({data, columnsToDisplay, onDownloadExcel}) => {....}
  allowExportToPdf: PropTypes.bool, // false by default
  onDownloadPdf: PropTypes.func, // pass function to handle this ({data, columnsToDisplay, onDownloadExcel}) => {....}
  expandedRowRender: PropTypes.func, // antd table expandedRowRender
  renderHeaders: PropTypes.func, // render content inside headers renderHeaders(props) => <div>Hello</div>
};

export default ReTable;
