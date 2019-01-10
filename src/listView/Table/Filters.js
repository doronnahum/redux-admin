import React, { Component } from 'react';
import {Tag} from 'antd';
import PropTypes from 'prop-types';
import FilterOptions, {allOperators, allLogical} from './FilterOptions';

class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFilters: []
    };
  };
  removeTag = (id) => {
    const newActiveFilters = this.state.activeFilters.filter(filter => filter.id !== id)
    this.setState({activeFilters: newActiveFilters})
  }
  onSave = ({activeFilters}) => {
    this.setState({activeFilters}, this.onClose)
  }
  onClose = () => {
    this.props.onClose()
  }
  renderActiveFilters = () => {
    const {activeFilters} = this.state
    if(activeFilters.length) {
      return (
        <div>
          <h2 style={{colors: 'black'}}>Filters:</h2>
          {
            activeFilters.map(({key, id, operator, value, type, label}) => {
              if(type === 'logical') return <Tag color="lightBlue" key={id} id={id} closable onClose={() => this.removeTag(id)}>{allLogical[value] && allLogical[value].label}</Tag>
              return <Tag color="blue" key={id} id={id} closable onClose={() => this.removeTag(id)}>{`${key} - ${allOperators[operator] && allOperators[operator].label} - ${allOperators[operator].formatter ? allOperators[operator].formatter(value) : value}`}</Tag>
            })
          }
        </div>
      )
    }
  }
  renderOptions = () => {
    return (
      <FilterOptions initialValues={this.state.activeFilters} onSave={this.onSave} onClose={this.onClose} fields={this.props.fields}/>
    )
  }

  render() {
    const {showOptions} = this.props
    return (
      <div className={'ra-table-filters'}>
        {(!showOptions) && this.renderActiveFilters()}
        {(showOptions) && this.renderOptions()}
      </div>
    );
  }
}

Filters.propTypes = {

};

export default Filters;
