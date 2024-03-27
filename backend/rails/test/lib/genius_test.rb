class GeniusTest < ActiveSupport::TestCase

  test "search should return an array" do
    genius_client = Genius.new
    search_response_json = JSON.parse(File.read("test/fixtures/genius/search_response.json"))
    genius_client.stub :request, search_response_json do
      assert_instance_of Array, genius_client.search("Wonderwall")
    end
  end
end