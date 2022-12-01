import { Component } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { SearchbarWrap, Form, Input, SearchBtn } from './Searchbar.styled';
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
    const searchQuery = this.state.searchQuery.trim().toLowerCase();
    if (searchQuery) {
      this.props.onSubmit(searchQuery);
    } else {
      alert(`Enter something`);
    }
  };

  render() {
    const { searchQuery } = this.state;
    return (
      <SearchbarWrap>
        <Form>
          <SearchBtn type="submit" onClick={this.onSearchBtnClick}>
            <AiOutlineSearch size="20" />
          </SearchBtn>

          <Input
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            maxLength="20"
            value={searchQuery}
            onChange={this.onInputChange}
          />
        </Form>
      </SearchbarWrap>
    );
  }
}
