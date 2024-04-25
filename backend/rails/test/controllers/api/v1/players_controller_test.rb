require "test_helper"

class PlayersControllerTest < ActionDispatch::IntegrationTest
  include Minitest::AuthHelper
  
  setup do
    @player = players(:one)
    @user = users(:one)
    @other_user = users(:two)
    @other_user_player = players(:two)
    login_as(@user)
  end

  test 'should not be able to access auth protected actions without a authorization' do
    assert_auth_endpoint(:post, api_v1_player_url)
    assert_auth_endpoint(:get, api_v1_player_url)
    assert_auth_endpoint(:patch, api_v1_player_url)
    assert_auth_endpoint(:delete, api_v1_player_url)
  end

  test "should not create player if one exists" do
    assert_no_difference("Player.count") do
      post api_v1_player_url, params: { player: { paused_at: @player.paused_at, started_at: @player.started_at } }, as: :json, headers: @headers
    end

    assert_response :created
    assert_equal @user.id, response.parsed_body["user_id"]
  end

  test "should show user's player" do
    get api_v1_player_url, as: :json, headers: @headers
    assert_response :success
    assert_equal @user.id, response.parsed_body["user_id"]
  end

  test "should update user's player" do
    patch api_v1_player_url, params: { player: { paused_at: @player.paused_at, started_at: @player.started_at } }, as: :json, headers: @headers
    assert_response :success
    assert_equal @user.id, response.parsed_body["user_id"]
  end

  test "should destroy user's player" do
    delete api_v1_player_url, as: :json, headers: @headers
    assert_response :no_content
    assert_nil @user.player
  end
end
