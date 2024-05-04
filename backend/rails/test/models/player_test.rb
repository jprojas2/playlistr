require "test_helper"

class PlayerTest < ActiveSupport::TestCase
  test "should only be one player per user" do
    existing_player = players(:one)
    player = Player.new(user_id: existing_player.user_id)
    assert_not player.valid?
  end

  test "should be able to play a playlist" do
    player = players(:one)
    playlist = playlists(:one)
    player.play_playlist(playlist)
    assert_equal player.songs, playlist.songs
    assert_equal player.playing_index, 0
  end

  test "should be able to play a playlist at a specific index" do
    player = players(:one)
    playlist = playlists(:one)
    player.play_playlist(playlist, 1)
    assert_equal player.playing_index, 1
  end

  test "should be able to play a song" do
    player = players(:one)
    song = songs(:one)
    player.play_song(song)
    assert_equal player.songs, [song]
    assert_equal player.playing_index, 0
    assert_equal player.player_items.last.song_index, 0
  end

  test "should be able to add a song" do
    player = players(:one)
    song = songs(:one)
    player.add_song(song)
    assert_includes player.songs, song
    #assert_equal player.player_items.last.song_index, player.songs.count - 1
  end

  test "should be able to remove a song" do
    player = players(:empty)
    song = songs(:one)
    player.add_song(song)
    player.remove_song_at(0)
    assert_not_includes player.songs, song
  end

  test "should be able to move a song" do
    player = players(:empty)
    song = songs(:one)
    other_song = songs(:two)
    player.add_song(song)
    player.add_song(other_song)
    assert_equal player.player_items[0].song_id, song.id
    assert_equal player.player_items[1].song_id, other_song.id
    player.move_song(0, 1)
    player.player_items.reload
    assert_equal player.player_items[0].song_id, other_song.id
    assert_equal player.player_items[1].song_id, song.id
  end

  test "should be able to pause" do
    player = players(:one)
    player.play
    player.pause
    assert_not player.playing
  end

  test "should be able to play" do
    player = players(:one)
    player.play
    assert player.playing
  end

  test "should be able to clear" do
    player = players(:one)
    player.add_song(songs(:one))
    player.clear
    assert_not player.playing
    assert_empty player.songs
  end

end
