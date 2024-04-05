require 'test_helper'

class ExternalIdTest < ActiveSupport::TestCase
  test "should validate eid uniqueness" do
    DummyClass.create(eid: "123")
    dummy_instance = DummyClass.create(eid: "123")
    assert_not dummy_instance.valid?
    assert_includes dummy_instance.errors.map{|e| [e.attribute, e.type]}, [:eid, :taken]
  end

  test "should validate eid presence" do
    dummy_instance = DummyClass.create
    assert_not dummy_instance.valid?
    assert_includes dummy_instance.errors.map{|e| [e.attribute, e.type]}, [:eid, :blank]
  end

  test "should return eid as param" do
    dummy_instance = DummyClass.create(eid: "123")
    assert_equal dummy_instance.to_param, "123"
  end

  test "initialize by eid" do
    dummy_instance = DummyClass.initialize_by_eid("123")
    assert_instance_of DummyClass, dummy_instance
    assert_equal dummy_instance.eid, "123"
    assert dummy_instance.new_record?
  end

  test "find or initialize by eid" do
    DummyClass.expects(:initialize_by_eid).with("123").returns(DummyClass.new(eid: "123")).once
    dummy_instance = DummyClass.find_or_initialize_by_eid("123")
    dummy_instance.save

    dummy_instance = DummyClass.find_or_initialize_by_eid("123")
    assert_instance_of DummyClass, dummy_instance
    assert_equal dummy_instance.eid, "123"
    assert_not dummy_instance.new_record?
  end
end

class DummyClass < ApplicationRecord
  include ExternalId
  self.table_name = "songs"
end
