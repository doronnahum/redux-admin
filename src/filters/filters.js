import React, { Component } from 'react';
import {Tag, Button} from 'antd';
import PropTypes from 'prop-types';
import FilterOptions, {allOperators, allLogical} from './FilterOptions';

class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFilters: [],
    };
  };

  removeTag = (id) => {
    const newActiveFilters = this.state.activeFilters.filter(filter => filter.id !== id)
    this.setState({activeFilters: newActiveFilters}, () => this.props.onFiltersChanged(newActiveFilters))
  }

  onSave = ({activeFilters}) => {
    const _activeFilters = activeFilters.filter(item => (item.value !== '' && item.value))
    this.setState({activeFilters}, () => {
      this.props.onFiltersChanged(_activeFilters)
      this.props.hideAdvanceOptions()
    })
  }

  renderActiveFilters = () => {
    const {activeFilters} = this.state
    if(activeFilters.length) {
      return (
        <div>
          <h2 style={{colors: 'black'}}>Filters:</h2>
          {
            activeFilters.map(({key, id, operator, value, type, label, active}) => {
              if(type === 'logical') return <Tag color="lightBlue" key={id} id={id} closable onClose={() => this.removeTag(id)}>{allLogical[value] && allLogical[value].label}</Tag>
              return <Tag className={active ? '' : 'ra-text-line-through'} key={id} id={id} closable onClose={() => this.removeTag(id)}>{`${key} - ${allOperators[operator] && allOperators[operator].label} - ${allOperators[operator].formatter ? allOperators[operator].formatter(value) : value}`}</Tag>
            })
          }
        </div>
      )
    }
  }

  renderOptions = () => {
    return (
      <div className='ra-filtersOptionsWrapper'>
        <h2 className='ra-filtersOptionsTitle'>Filters settings:</h2>
        <FilterOptions advanceMode initialValues={this.state.activeFilters} onSave={this.onSave} hideAdvanceOptions={this.props.hideAdvanceOptions} fields={this.props.fields}/>
      </div>
    )
  }

  renderSimpleFilter = () => {
    return (
      <FilterOptions
        initialValues={this.state.simpleSearch}
        onSave={this.onSave}
        hideAdvanceOptions={this.props.hideAdvanceOptions}
        fields={this.props.fields}
        advanceMode={false}
      />
    )
  }

  render() {
    const {showAdvanceOptions} = this.props
    return (
      <div className={'ra-filters'}>
        {(showAdvanceOptions) && this.renderOptions()}
        {(!showAdvanceOptions && !!this.state.activeFilters.length && this.state.activeFilters[0].advanceMode) && this.renderActiveFilters()}
        {(!showAdvanceOptions && (!this.state.activeFilters.length || !this.state.activeFilters[0].advanceMode)) && this.renderSimpleFilter()}
      </div>
    );
  }
}

Filters.propTypes = {

};

export default Filters;
