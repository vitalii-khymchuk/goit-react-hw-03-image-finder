import { Component } from 'react';
import Searchbar from './Searchbar';
import Main from './Main';

export class App extends Component {
  state = {
    searchQuery: '',
  };

  getQuery = searchQuery => {
    this.setState({ searchQuery });
  };
  render() {
    const { searchQuery } = this.state;
    return (
      <>
        <Searchbar onSubmit={this.getQuery} />
        <Main searchQuery={searchQuery} />
      </>
    );
  }
}
