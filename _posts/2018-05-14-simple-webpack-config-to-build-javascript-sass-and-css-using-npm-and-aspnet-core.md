---
title: Simple webpack config to build javascript, sass and css using NPM and ASP.NET Core
date: 2018-04-14
layout: post
---

I have been working on a ASP.NET Core project that requires me to build and publish sass stylesheets, css and javascript. I wanted to streamline the process so I put together this simple [webpack](https://webpack.js.org/) setup to automate what had been a couple of manual steps.

Webpack and its various plugins require Node.js to run and NPM to install. The package.json file tracks the node dependencies for the project. The packages I am using for Webpack are installed as devDependencies and can be added using the npm install command with the -D flag eg:

    npm install webpack -D

This is my package.json file:

<script src="https://gist.github.com/lukencode/017c8d2105498c32c1bfe9bc87711ad7.js"></script>

I will explain a couple of the packages I am including here when we look at my actual webpack config. You can install all packages using "npm install" in the directory of package.json. I am also using npm to run the webpack scripts. I found this a much simpler option than including extra grunt/gulp scripts. The scripts are pretty straight forward build and build:dev run webpack with flags to tell it the environment and whether it should minimize the output. Th watch script is useful during development as it will automatically rebuild assets when it detects a file has changed.

<script src="https://gist.github.com/lukencode/a48ca54cedc442f6dd36fd72460f3a10.js"></script>

This is the webpack config script that is being run by npm. It reads a single "entry" javascript file and builds any javascript, css or sass included to the specified output path. 

The work is done by the loaders configured in the modules section. [Babel](https://babeljs.io/) is a popular javascript compiler which allows you to use ES2015 and other things easily on the web.

The css and sass rules are using the 'extract-text-webpack-plugin' to pull out the resulting css into a separate file ('site.css'). Webpack allows for some pretty fancy setups where css is rendered inline or bundled with javascript components like react and vuejs but for my purposes I am going with a single seperate css file. 

The entry file will include javascript import or require statements for dependencies in addition to any javascript for the application. This includes the sass or css dependencies although this webpack script is configured to export those to a separate file. Example import statements in app.js:

    import '../css/theme.scss'
    import '../vendor/tagsinput'

The scripts so far are completely independent to the ASP.NET Core application and work well being run as npm scripts from the console:

    npm run build
    npm run watch
 
 We can integrate the into the .net build and publish workflow by adding some steps the the build process in the projects .csproj file. These scripts come from good post on [codeburst.io on webpack](https://codeburst.io/how-to-use-webpack-in-asp-net-core-projects-a-basic-react-template-sample-25a3681a5fc2).

      <Target Name="DebugRunWebpack" BeforeTargets="Build" Condition=" '$(Configuration)' == 'Debug' And !Exists('wwwroot\dist') ">
        <!-- Ensure Node.js is installed -->
        <Exec Command="node --version" ContinueOnError="true">
          <Output TaskParameter="ExitCode" PropertyName="ErrorCode" />
        </Exec>
        <Error Condition="'$(ErrorCode)' != '0'" Text="Node.js is required to build and run this project. To continue, please install Node.js from https://nodejs.org/, and then restart your command prompt or IDE." />
        <!-- In development, the dist files won't exist on the first run or when cloning to a different machine, so rebuild them if not already present. -->
        <Message Importance="high" Text="Performing first-run Webpack build..." />
        <Exec Command="npm run build:dev" />
      </Target>
      
      <Target Name="PublishRunWebpack" AfterTargets="ComputeFilesToPublish">
        <Exec Command="npm install" />
        <Exec Command="npm run build" />    
        <ItemGroup>
          <DistFiles Include="wwwroot\dist\**" />
          <ResolvedFileToPublish Include="@(DistFiles->'%(FullPath)')" Exclude="@(ResolvedFileToPublish)">
            <RelativePath>%(DistFiles.Identity)</RelativePath>
            <CopyToPublishDirectory>PreserveNewest</CopyToPublishDirectory>
          </ResolvedFileToPublish>
        </ItemGroup>
      </Target>

The "DebugRunWebpack" target will build the assets in dev mode if they dont already exist. "PublishRunWebpack" will build and include the files when running dotnet publish. This is useful for automated build pipelines such as visual studio online.

The setup here is very basic and a good starting point - especially if you are not using a framework such as react. Functionality that could be added depending on the project is separating the vendor assets into a different file/process as well as adding linting, source maps and more to the webpack config.
