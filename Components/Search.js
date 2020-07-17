//Components/Search.js
import React from 'react'
import { StyleSheet, View, TextInput, Button, FlatList, Text, ActivityIndicator } from 'react-native'
import films from '../Helpers/filmsData.js'
import FilmItem from './FilmItem.js'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi.js'

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.searchedText = ""
    this.page = 0
    this.totalPages = 0
    this.state = {
      films: [],
      isLoading: false
    }
  }
  _searchTextInputChanged(text) {
    this.searchedText = text
  }
  render() {
    return (
      <View style={styles.main_container}>
        <TextInput
          style={styles.textinput}
          placeholder='Titre du film'
          onChangeText={(text) => this._searchTextInputChanged(text)}
          onSubmitEditing =  {() => this._searchFilms()}
        />

        <Button title='Rechercher' onPress={() => this._searchFilms()}/>

        <FlatList
          data={this.state.films}
          keyExtractor = { (item) => item.id.toString() }
          renderItem={({item}) => <FilmItem film={item}/>}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (this.page < this.totalPages) {
              this._loadFilms()
            }
          }}
        />
      </View>
    )
  }
  _loadFilms() {
    if (this.searchedText.length > 0) {
      this.setState({ isLoading: true })
      getFilmsFromApiWithSearchedText(this.searchedText, this.page+1).then(data => {
        this.page = data.page
        this.totalPages = data.total_pages
        this.setState({
          films: [...this.state.films, ...data.results],
          isLoading: false
        })
      });
    }
  }
  _displayLoading() {
    if(this.state.isLoading) {
      return (
        <View style = {styles.loading_container}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
  }
  _searchFilms() {
    this.page = 0
    this.totalPages = 0
    this.setState({
      films: [],
    }, () => {
      console.log('Page:' + this.page + " / TotalPage: " + this.totalPages + " / Nombre de films: " + this.state.films.length)
      this._loadFilms()
    })
  }
}
const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    marginTop: 60
  },

  textinput: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    paddingLeft: 5
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Search
