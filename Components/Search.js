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
    this.state = {
      films: [],
      isLoading: false
    }
  }
  _searchTextInputChanged(text) {
    this.searchedText = text
  }
  render() {
    console.log("LOG: RENDER")
    return (
      <View style={styles.main_container}>
        <TextInput
          style={styles.textinput}
          placeholder='Titre du film'
          onChangeText={(text) => this._searchTextInputChanged(text)}
          onSubmitEditing =  {() => this._loadFilms()}
        />

        <Button title='Rechercher' onPress={() => this._loadFilms()}/>

        <FlatList
          data={this.state.films}
          keyExtractor = { (item) => item.id.toString() }
          renderItem={({item}) => <FilmItem film={item}/>}
        />
      </View>
    )
  }
  _loadFilms() {
    if (this.searchedText.length > 0) {
      this.setState({ isLoading: true })
      getFilmsFromApiWithSearchedText(this.searchedText).then(data => {
        this.setState({ films: data.results })
        isLoading: false
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
