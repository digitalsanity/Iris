
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import FontAwesome from 'react-fontawesome'

import Header from '../../components/Header'
import List from '../../components/List'
import TrackList from '../../components/TrackList'

import * as mopidyActions from '../../services/mopidy/actions'
import * as spotifyActions from '../../services/spotify/actions'

class LibraryLocalDirectory extends React.Component{

	constructor(props) {
		super(props);
	}

	// on render
	componentDidMount(){
		this.loadDirectory()
	}

	componentWillReceiveProps( nextProps ){

		// mopidy goes online
		if( !this.props.mopidy_connected && nextProps.mopidy_connected ){
			this.loadDirectory( nextProps );
		}

		// our uri changes
		if( nextProps.params.uri != this.props.params.uri ){
			this.loadDirectory( nextProps );
		}
	}

	loadDirectory( props = this.props ){
		if( props.mopidy_connected ){
			this.props.mopidyActions.getDirectory( props.params.uri );
		}
	}

	arrange_directory( directory ){
		var folders = []
		var tracks = []

		for (var i = 0; i < directory.length; i++) {
			if (directory[i].type && directory[i].type == 'track') {
				tracks.push( directory[i] )
			} else {
				folders.push( directory[i] )
			}
		}

		return {
			folders: folders,
			tracks: tracks
		}
	}

	render(){
		if( !this.props.directory ) return null

		var items = this.arrange_directory( this.props.directory )

		var actions = null
		if (this.props.params.uri != 'local:directory' ){
			actions = (
				<button onClick={ () => window.history.back() }>
					<FontAwesome name="reply" />&nbsp;
					Back
				</button>
			)
		}

		return (
			<div className="view library-local-view">
				<Header icon="music" title="Local files" actions={actions} />
				<section className="list-wrapper">

					<List columns={[{ name: 'name', width: '100'}]} rows={items.folders} link_prefix={global.baseURL+"library/local/directory/"} />
					<TrackList tracks={items.tracks} noheader />
				</section>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		mopidy_connected: state.mopidy.connected,
		directory: state.mopidy.directory
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		mopidyActions: bindActionCreators(mopidyActions, dispatch),
		spotifyActions: bindActionCreators(spotifyActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LibraryLocalDirectory)