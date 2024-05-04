require "test_helper"

class PlaylistSongsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @playlist_song = playlist_songs(:one)
  end

  test "should create playlist_song" do
    assert_difference("PlaylistSong.count") do
      post playlist_songs_url, params: { playlist_song: { playlist_id: @playlist_song.playlist_id, song_id: @playlist_song.song_id, song_index: @playlist_song.song_index } }, as: :json
    end

    assert_response :created
  end

  test "should update playlist_song" do
    patch playlist_song_url(@playlist_song), params: { playlist_song: { playlist_id: @playlist_song.playlist_id, song_id: @playlist_song.song_id, song_index: @playlist_song.song_index } }, as: :json
    assert_response :success
  end
end
