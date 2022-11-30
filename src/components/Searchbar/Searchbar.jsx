import { Component } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
// Чи краще тут обійтись без стейту і використати неконтрольований елемент і просто сабмітити результат?
export default class Searchbar extends Component {
  state = {
    searchQuery: '',
  };
  onInputChange = e => {
    const searchQuery = e.currentTarget.value;
    this.setState({ searchQuery });
  };
  onSearchBtnClick = e => {
    e.preventDefault();
    const searchQuery = this.state.searchQuery;
    this.props.onSubmit(searchQuery);
  };

  render() {
    const { searchQuery } = this.state;
    return (
      <header className="Searchbar">
        <form className="SearchForm">
          <button
            type="submit"
            onClick={this.onSearchBtnClick}
            className="SearchForm-button"
          >
            <AiOutlineSearch size="20" />
          </button>

          <input
            className="SearchForm-input"
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            maxLength="10"
            value={searchQuery}
            onChange={this.onInputChange}
          />
        </form>
      </header>
    );
  }
}
