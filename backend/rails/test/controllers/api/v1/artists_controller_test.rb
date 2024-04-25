require "test_helper"

class ArtistsControllerTest < ActionDispatch::IntegrationTest
  include Minitest::AuthHelper

  setup do
    @artist = artists(:one)
    login
  end

  test 'should not be able to access auth protected actions without a authorization' do
    assert_auth_endpoint(:get, api_v1_artists_url)
    assert_auth_endpoint(:get, api_v1_artist_url(@artist))
  end

  test "should get index" do
    get api_v1_artists_url, as: :json, headers: @headers
    assert_response :success
  end

  test "should show artist" do
    Artist.expects(:find_or_initialize_by_eid).with(@artist.eid).once.returns(@artist)
    Artist.any_instance.expects(:top_songs).once.returns([])
    get api_v1_artist_url(@artist), as: :json, headers: @headers
    assert_response :success
  end
end
