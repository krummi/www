class StaticController < ApplicationController
  def index
  end

  def p2p
  	@blogs = Blog.tagged_with('p2p').where(is_published: true).order("published_at DESC")
  end
end
