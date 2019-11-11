import React, { Component } from 'react';
import { Tag, Button } from 'antd';
import PropTypes from 'prop-types';
import FilterOptions, { allOperators, allLogical } from './FilterOptions';
import { LOCALS } from '../local';

class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFilters: [],
    };
  }

  removeTag = (id) => {
    const newActiveFilters = this.state.activeFilters.filter((filter) => filter.id !== id);
    this.setState({ activeFilters: newActiveFilters }, () => this.props.onFiltersChanged(newActiveFilters));
  }

  onSave = ({ activeFilters }) => {
    const _activeFilters = activeFilters.filter((item) => (item.value !== '' && item.value));
    this.setState({ activeFilters }, () => {
      this.props.onFiltersChanged(_activeFilters);
      this.props.hideAdvanceOptions();
    });
  }

  onTagClick = (e) => {
    const classNames = (e && e.target && e.target.getAttribute && e.target.getAttribute('class')) || [];
    const isOutOFThCloseButton = classNames.includes('activeFilters');
    if (isOutOFThCloseButton) {
      this.props.onShowAdvanceOptions();
    }
  };

  renderActiveFilters = () => {
    const { activeFilters } = this.state;
    if (activeFilters.length) {
      return (
        <div>
          <h2 style={{ colors: 'black' }}>{LOCALS.FILTERS_TITLE}</h2>
          {
            activeFilters.map(({ key, id, operator, value, type, label, active }) => {
              if (type === 'logical') return <Tag className="activeFilters" onClick={this.onTagClick} color="lightBlue" key={id} id={id} closable onClose={() => this.removeTag(id)}>{allLogical[value] && allLogical[value].label}</Tag>;
              return <Tag className={active ? 'activeFilters' : 'ra-text-line-through activeFilters'} onClick={this.onTagClick} key={id} id={id} closable onClose={() => this.removeTag(id)}>{`${key} - ${allOperators[operator] && allOperators[operator].label} - ${allOperators[operator].formatter ? allOperators[operator].formatter(value) : value}`}</Tag>;
            })
          }
        </div>
      );
    }
  }

  renderOptions = () => (
      <div className="ra-filtersOptionsWrapper">
        <h2 className="ra-filtersOptionsTitle">{LOCALS.FILTERS_SETTINGS_TITLE}</h2>
        <FilterOptions advanceMode initialValues={this.state.activeFilters} onSave={this.onSave} hideAdvanceOptions={this.props.hideAdvanceOptions} fields={this.props.fields} />
      </div>
    )

  renderSimpleFilter = () => (
      <FilterOptions
        initialValues={this.state.simpleSearch}
        onSave={this.onSave}
        hideAdvanceOptions={this.props.hideAdvanceOptions}
        fields={this.props.fields}
        advanceMode={false}
      />
    )

  render() {
    const { showAdvanceOptions } = this.props;
    return (
      <div className="ra-filters">
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
