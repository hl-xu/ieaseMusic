
import React, { Component } from 'react';
import { Link } from 'react-router';
import { inject, observer } from 'mobx-react';
import clazz from 'classname';
import injectSheet from 'react-jss';

import classes from './classes';
import Loader from 'ui/Loader';
import FadeImage from 'ui/FadeImage';
import ProgressImage from 'ui/ProgressImage';
import Header from 'components/Header';

@inject(stores => ({
    loading: stores.fm.loading,
    getFM: stores.fm.preload,
    songs: stores.fm.playlist.songs,
    song: stores.fm.song,
    next: stores.fm.next,
    play: stores.fm.play,
    like: stores.me.like,
    unlike: stores.me.unlike,
    isLiked: stores.me.isLiked,

    isFMPlaying() {
        var { controller, fm } = stores;
        return controller.playlist.id === fm.playlist.id;
    },

    isPlaying() {
        var { controller, fm } = stores;

        return controller.playing
            && controller.playlist.id === fm.playlist.id;
    },
}))
@observer
class FM extends Component {
    componentWillMount() {
        this.props.getFM();
    }

    renderBG() {
        var { classes, songs } = this.props;

        return (
            <div className={classes.covers}>
                {
                    songs.map((e, index) => {
                        return (
                            <div
                                className={classes.cover}
                                key={index}>
                                <FadeImage src={e.album.cover} />
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    render() {
        var { classes, loading, isFMPlaying, isLiked, like, unlike, song, next } = this.props;
        var liked = false;

        if (loading) {
            return (
                <Loader show={true} />
            );
        }

        liked = isLiked(song.id);

        return (
            <div className={classes.container}>
                <Header {...{
                    color: 'white',
                    showBack: true,
                }} />
                {this.renderBG()}

                <section className={classes.main}>
                    <article>
                        <ProgressImage {...{
                            height: 290,
                            width: 290,
                            src: song.album.cover,
                        }} />

                        <aside>
                            <p className={classes.title}>
                                <span title={song.name}>
                                    {song.name}
                                </span>
                            </p>
                            <p className={classes.artists}>
                                <span>
                                    {
                                        song.artists.map((e, index) => {
                                            return (
                                                <Link
                                                    key={index}
                                                    to={e.link}>
                                                    {e.name}
                                                </Link>
                                            );
                                        })
                                    }
                                </span>
                            </p>
                            <p className={classes.album}>
                                <span>
                                    <Link
                                        title={song.album.name}
                                        to={song.album.link}>
                                        {song.album.name}
                                    </Link>
                                </span>
                            </p>
                        </aside>
                    </article>

                    {
                        isFMPlaying() && (
                            <div
                                className={classes.bar}
                                id="progress">
                                <div className={classes.playing} />
                                <div className={classes.buffering} />
                            </div>
                        )
                    }

                    <div className={classes.controls}>
                        <i
                            className={clazz('ion-ios-heart', {
                                [classes.liked]: liked,
                            })}
                            onClick={e => liked ? unlike(song) : like(song)} />

                        <i className="ion-android-arrow-down" />

                        <span onClick={e => this.props.play()}>
                            {
                                this.props.isPlaying()
                                    ? <i className="ion-ios-pause" />
                                    : <i className="ion-ios-play" />
                            }
                        </span>

                        <i
                            className="ion-ios-fastforward"
                            onClick={next}
                            style={{
                                marginRight: 0,
                            }} />
                    </div>
                </section>
            </div>
        );
    }
}

export default injectSheet(classes)(FM);
