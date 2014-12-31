class BlogsController < ApplicationController
  
  http_basic_authenticate_with name: ENV['ADMIN_USER'], 
                               password: ENV['ADMIN_PASS'], 
                               except: :show

  before_action :set_blog, only: [:show, :edit, :update, :destroy]

  # GET /blogs
  # GET /blogs.json
  def index
    @blogs = Blog.order(['is_published', 'published_at'])
  end

  # GET /blogs/title
  # GET /blogs/title.json
  # GET /title
  # GET /title.json
  def show
    if !@blog 
      raise ActionController::RoutingError.new('Not Found')
    elsif request.path != short_blog_path(@blog)
      return redirect_to @blog, :status => :moved_permanently
    else
      @blog.increment!(:views)
    end
  end

  # GET /blogs/new
  def new
    @blog = Blog.new
    @blog.save
    redirect_to edit_blog_path(@blog.id)
  end

  # GET /blogs/1/edit
  def edit
  end

  # PATCH /blogs/1/publish 
  def publish
    @blog = Blog.friendly.find(params[:blog_id])
    respond_to do |format|
      if @blog.update(is_published: !@blog.is_published, published_at: DateTime.now)
        format.json { head :no_content }
      else
        format.json { render json: @blog.errors, status: :unprocessable_entity }
      end
    end
  end

  # POST /blogs
  # POST /blogs.json
  def create
    @blog = Blog.new(blog_params)

    respond_to do |format|
      if @blog.save
        format.html { redirect_to @blog, notice: 'Blog was successfully created.' }
        format.json { render action: 'show', status: :created, location: @blog }
      else
        format.html { render action: 'new' }
        format.json { render json: @blog.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /blogs/1
  # PATCH/PUT /blogs/1.json
  def update
    # Tagging.
    respond_to do |format|
      if @blog.update(blog_params)
        @blog.tag_list = params['tags']
        format.html { redirect_to @blog, notice: 'Blog was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @blog.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /blogs/1
  # DELETE /blogs/1.json
  def destroy
    @blog.destroy
    respond_to do |format|
      format.html { redirect_to blogs_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_blog
      begin
        @blog = Blog.friendly.find(params[:id])
      rescue
        @blog = nil
      end
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def blog_params
      params.require(:blog).permit(:title, :body_md, :body_html, :published_at, :tags, :is_published)
    end
end
