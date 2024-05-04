require "test_helper"

class PlaylistSongsControllerTest < ActionDispatch::IntegrationTest
  include Minitest::AuthHelper
  
  setup do
    @playlist = playlists(:one)
    @playlist_song = playlist_songs(:one)
    login
  end

  test 'should not be able to access auth protected actions without a authorization' do
    assert_auth_endpoint(:post, api_v1_playlist_playlist_songs_url(@playlist))
    assert_auth_endpoint(:get, api_v1_playlist_playlist_songs_url(@playlist))
    assert_auth_endpoint(:delete, api_v1_playlist_playlist_song_url(@playlist, @playlist_song))
  end

  test "should get index" do
    get api_v1_playlist_playlist_songs_url(@playlist), as: :json, headers: @headers
    assert_response :success
  end

  test "should create playlist_song" do
    Song.expects(:find_or_initialize_by_eid).with(@playlist_song.song.eid).once.returns(@playlist_song.song)

    assert_difference("PlaylistSong.count") do
      post api_v1_playlist_playlist_songs_url(@playlist), params: { playlist_song: { playlist_id: @playlist_song.playlist_id, song_id: @playlist_song.song.eid, song_index: @playlist_song.song_index } }, headers: @headers
    end

    assert_response :created
  end

  test "should destroy playlist_song" do
    delete api_v1_playlist_playlist_song_url(@playlist, @playlist_song), as: :json, headers: @headers

    assert_response :no_content
  end
end
