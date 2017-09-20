<?php

// autoload_classmap.php @generated by Composer

$vendorDir = dirname(dirname(__FILE__));
$baseDir = dirname($vendorDir);

return array(
    'Alchemy\\Zippy\\Adapter\\AbstractAdapter' => $vendorDir . '/alchemy/zippy/src/Adapter/AbstractAdapter.php',
    'Alchemy\\Zippy\\Adapter\\AbstractBinaryAdapter' => $vendorDir . '/alchemy/zippy/src/Adapter/AbstractBinaryAdapter.php',
    'Alchemy\\Zippy\\Adapter\\AbstractTarAdapter' => $vendorDir . '/alchemy/zippy/src/Adapter/AbstractTarAdapter.php',
    'Alchemy\\Zippy\\Adapter\\AdapterContainer' => $vendorDir . '/alchemy/zippy/src/Adapter/AdapterContainer.php',
    'Alchemy\\Zippy\\Adapter\\AdapterInterface' => $vendorDir . '/alchemy/zippy/src/Adapter/AdapterInterface.php',
    'Alchemy\\Zippy\\Adapter\\BSDTar\\TarBSDTarAdapter' => $vendorDir . '/alchemy/zippy/src/Adapter/BSDTar/TarBSDTarAdapter.php',
    'Alchemy\\Zippy\\Adapter\\BSDTar\\TarBz2BSDTarAdapter' => $vendorDir . '/alchemy/zippy/src/Adapter/BSDTar/TarBz2BSDTarAdapter.php',
    'Alchemy\\Zippy\\Adapter\\BSDTar\\TarGzBSDTarAdapter' => $vendorDir . '/alchemy/zippy/src/Adapter/BSDTar/TarGzBSDTarAdapter.php',
    'Alchemy\\Zippy\\Adapter\\BinaryAdapterInterface' => $vendorDir . '/alchemy/zippy/src/Adapter/BinaryAdapterInterface.php',
    'Alchemy\\Zippy\\Adapter\\GNUTar\\TarBz2GNUTarAdapter' => $vendorDir . '/alchemy/zippy/src/Adapter/GNUTar/TarBz2GNUTarAdapter.php',
    'Alchemy\\Zippy\\Adapter\\GNUTar\\TarGNUTarAdapter' => $vendorDir . '/alchemy/zippy/src/Adapter/GNUTar/TarGNUTarAdapter.php',
    'Alchemy\\Zippy\\Adapter\\GNUTar\\TarGzGNUTarAdapter' => $vendorDir . '/alchemy/zippy/src/Adapter/GNUTar/TarGzGNUTarAdapter.php',
    'Alchemy\\Zippy\\Adapter\\Resource\\FileResource' => $vendorDir . '/alchemy/zippy/src/Adapter/Resource/FileResource.php',
    'Alchemy\\Zippy\\Adapter\\Resource\\ResourceInterface' => $vendorDir . '/alchemy/zippy/src/Adapter/Resource/ResourceInterface.php',
    'Alchemy\\Zippy\\Adapter\\Resource\\ZipArchiveResource' => $vendorDir . '/alchemy/zippy/src/Adapter/Resource/ZipArchiveResource.php',
    'Alchemy\\Zippy\\Adapter\\VersionProbe\\AbstractTarVersionProbe' => $vendorDir . '/alchemy/zippy/src/Adapter/VersionProbe/AbstractTarVersionProbe.php',
    'Alchemy\\Zippy\\Adapter\\VersionProbe\\BSDTarVersionProbe' => $vendorDir . '/alchemy/zippy/src/Adapter/VersionProbe/BSDTarVersionProbe.php',
    'Alchemy\\Zippy\\Adapter\\VersionProbe\\GNUTarVersionProbe' => $vendorDir . '/alchemy/zippy/src/Adapter/VersionProbe/GNUTarVersionProbe.php',
    'Alchemy\\Zippy\\Adapter\\VersionProbe\\VersionProbeInterface' => $vendorDir . '/alchemy/zippy/src/Adapter/VersionProbe/VersionProbeInterface.php',
    'Alchemy\\Zippy\\Adapter\\VersionProbe\\ZipExtensionVersionProbe' => $vendorDir . '/alchemy/zippy/src/Adapter/VersionProbe/ZipExtensionVersionProbe.php',
    'Alchemy\\Zippy\\Adapter\\VersionProbe\\ZipVersionProbe' => $vendorDir . '/alchemy/zippy/src/Adapter/VersionProbe/ZipVersionProbe.php',
    'Alchemy\\Zippy\\Adapter\\ZipAdapter' => $vendorDir . '/alchemy/zippy/src/Adapter/ZipAdapter.php',
    'Alchemy\\Zippy\\Adapter\\ZipExtensionAdapter' => $vendorDir . '/alchemy/zippy/src/Adapter/ZipExtensionAdapter.php',
    'Alchemy\\Zippy\\Archive\\Archive' => $vendorDir . '/alchemy/zippy/src/Archive/Archive.php',
    'Alchemy\\Zippy\\Archive\\ArchiveInterface' => $vendorDir . '/alchemy/zippy/src/Archive/ArchiveInterface.php',
    'Alchemy\\Zippy\\Archive\\Member' => $vendorDir . '/alchemy/zippy/src/Archive/Member.php',
    'Alchemy\\Zippy\\Archive\\MemberInterface' => $vendorDir . '/alchemy/zippy/src/Archive/MemberInterface.php',
    'Alchemy\\Zippy\\Exception\\ExceptionInterface' => $vendorDir . '/alchemy/zippy/src/Exception/ExceptionInterface.php',
    'Alchemy\\Zippy\\Exception\\FormatNotSupportedException' => $vendorDir . '/alchemy/zippy/src/Exception/FormatNotSupportedException.php',
    'Alchemy\\Zippy\\Exception\\IOException' => $vendorDir . '/alchemy/zippy/src/Exception/IOException.php',
    'Alchemy\\Zippy\\Exception\\InvalidArgumentException' => $vendorDir . '/alchemy/zippy/src/Exception/InvalidArgumentException.php',
    'Alchemy\\Zippy\\Exception\\NoAdapterOnPlatformException' => $vendorDir . '/alchemy/zippy/src/Exception/NoAdapterOnPlatformException.php',
    'Alchemy\\Zippy\\Exception\\NotSupportedException' => $vendorDir . '/alchemy/zippy/src/Exception/NotSupportedException.php',
    'Alchemy\\Zippy\\Exception\\RuntimeException' => $vendorDir . '/alchemy/zippy/src/Exception/RuntimeException.php',
    'Alchemy\\Zippy\\Exception\\TargetLocatorException' => $vendorDir . '/alchemy/zippy/src/Exception/TargetLocatorException.php',
    'Alchemy\\Zippy\\FileStrategy\\AbstractFileStrategy' => $vendorDir . '/alchemy/zippy/src/FileStrategy/AbstractFileStrategy.php',
    'Alchemy\\Zippy\\FileStrategy\\FileStrategyInterface' => $vendorDir . '/alchemy/zippy/src/FileStrategy/FileStrategyInterface.php',
    'Alchemy\\Zippy\\FileStrategy\\TB2FileStrategy' => $vendorDir . '/alchemy/zippy/src/FileStrategy/TB2FileStrategy.php',
    'Alchemy\\Zippy\\FileStrategy\\TBz2FileStrategy' => $vendorDir . '/alchemy/zippy/src/FileStrategy/TBz2FileStrategy.php',
    'Alchemy\\Zippy\\FileStrategy\\TGzFileStrategy' => $vendorDir . '/alchemy/zippy/src/FileStrategy/TGzFileStrategy.php',
    'Alchemy\\Zippy\\FileStrategy\\TarBz2FileStrategy' => $vendorDir . '/alchemy/zippy/src/FileStrategy/TarBz2FileStrategy.php',
    'Alchemy\\Zippy\\FileStrategy\\TarFileStrategy' => $vendorDir . '/alchemy/zippy/src/FileStrategy/TarFileStrategy.php',
    'Alchemy\\Zippy\\FileStrategy\\TarGzFileStrategy' => $vendorDir . '/alchemy/zippy/src/FileStrategy/TarGzFileStrategy.php',
    'Alchemy\\Zippy\\FileStrategy\\ZipFileStrategy' => $vendorDir . '/alchemy/zippy/src/FileStrategy/ZipFileStrategy.php',
    'Alchemy\\Zippy\\Parser\\BSDTarOutputParser' => $vendorDir . '/alchemy/zippy/src/Parser/BSDTarOutputParser.php',
    'Alchemy\\Zippy\\Parser\\GNUTarOutputParser' => $vendorDir . '/alchemy/zippy/src/Parser/GNUTarOutputParser.php',
    'Alchemy\\Zippy\\Parser\\ParserFactory' => $vendorDir . '/alchemy/zippy/src/Parser/ParserFactory.php',
    'Alchemy\\Zippy\\Parser\\ParserInterface' => $vendorDir . '/alchemy/zippy/src/Parser/ParserInterface.php',
    'Alchemy\\Zippy\\Parser\\ZipOutputParser' => $vendorDir . '/alchemy/zippy/src/Parser/ZipOutputParser.php',
    'Alchemy\\Zippy\\ProcessBuilder\\ProcessBuilderFactory' => $vendorDir . '/alchemy/zippy/src/ProcessBuilder/ProcessBuilderFactory.php',
    'Alchemy\\Zippy\\ProcessBuilder\\ProcessBuilderFactoryInterface' => $vendorDir . '/alchemy/zippy/src/ProcessBuilder/ProcessBuilderFactoryInterface.php',
    'Alchemy\\Zippy\\Resource\\PathUtil' => $vendorDir . '/alchemy/zippy/src/Resource/PathUtil.php',
    'Alchemy\\Zippy\\Resource\\Reader\\Guzzle\\GuzzleReader' => $vendorDir . '/alchemy/zippy/src/Resource/Reader/Guzzle/GuzzleReader.php',
    'Alchemy\\Zippy\\Resource\\Reader\\Guzzle\\GuzzleReaderFactory' => $vendorDir . '/alchemy/zippy/src/Resource/Reader/Guzzle/GuzzleReaderFactory.php',
    'Alchemy\\Zippy\\Resource\\Reader\\Guzzle\\LegacyGuzzleReader' => $vendorDir . '/alchemy/zippy/src/Resource/Reader/Guzzle/LegacyGuzzleReader.php',
    'Alchemy\\Zippy\\Resource\\Reader\\Guzzle\\LegacyGuzzleReaderFactory' => $vendorDir . '/alchemy/zippy/src/Resource/Reader/Guzzle/LegacyGuzzleReaderFactory.php',
    'Alchemy\\Zippy\\Resource\\Reader\\Stream\\StreamReader' => $vendorDir . '/alchemy/zippy/src/Resource/Reader/Stream/StreamReader.php',
    'Alchemy\\Zippy\\Resource\\Reader\\Stream\\StreamReaderFactory' => $vendorDir . '/alchemy/zippy/src/Resource/Reader/Stream/StreamReaderFactory.php',
    'Alchemy\\Zippy\\Resource\\RequestMapper' => $vendorDir . '/alchemy/zippy/src/Resource/RequestMapper.php',
    'Alchemy\\Zippy\\Resource\\Resource' => $vendorDir . '/alchemy/zippy/src/Resource/Resource.php',
    'Alchemy\\Zippy\\Resource\\ResourceCollection' => $vendorDir . '/alchemy/zippy/src/Resource/ResourceCollection.php',
    'Alchemy\\Zippy\\Resource\\ResourceLocator' => $vendorDir . '/alchemy/zippy/src/Resource/ResourceLocator.php',
    'Alchemy\\Zippy\\Resource\\ResourceManager' => $vendorDir . '/alchemy/zippy/src/Resource/ResourceManager.php',
    'Alchemy\\Zippy\\Resource\\ResourceReader' => $vendorDir . '/alchemy/zippy/src/Resource/ResourceReader.php',
    'Alchemy\\Zippy\\Resource\\ResourceReaderFactory' => $vendorDir . '/alchemy/zippy/src/Resource/ResourceReaderFactory.php',
    'Alchemy\\Zippy\\Resource\\ResourceTeleporter' => $vendorDir . '/alchemy/zippy/src/Resource/ResourceTeleporter.php',
    'Alchemy\\Zippy\\Resource\\ResourceWriter' => $vendorDir . '/alchemy/zippy/src/Resource/ResourceWriter.php',
    'Alchemy\\Zippy\\Resource\\TargetLocator' => $vendorDir . '/alchemy/zippy/src/Resource/TargetLocator.php',
    'Alchemy\\Zippy\\Resource\\TeleporterContainer' => $vendorDir . '/alchemy/zippy/src/Resource/TeleporterContainer.php',
    'Alchemy\\Zippy\\Resource\\Teleporter\\AbstractTeleporter' => $vendorDir . '/alchemy/zippy/src/Resource/Teleporter/AbstractTeleporter.php',
    'Alchemy\\Zippy\\Resource\\Teleporter\\GenericTeleporter' => $vendorDir . '/alchemy/zippy/src/Resource/Teleporter/GenericTeleporter.php',
    'Alchemy\\Zippy\\Resource\\Teleporter\\GuzzleTeleporter' => $vendorDir . '/alchemy/zippy/src/Resource/Teleporter/GuzzleTeleporter.php',
    'Alchemy\\Zippy\\Resource\\Teleporter\\LegacyGuzzleTeleporter' => $vendorDir . '/alchemy/zippy/src/Resource/Teleporter/LegacyGuzzleTeleporter.php',
    'Alchemy\\Zippy\\Resource\\Teleporter\\LocalTeleporter' => $vendorDir . '/alchemy/zippy/src/Resource/Teleporter/LocalTeleporter.php',
    'Alchemy\\Zippy\\Resource\\Teleporter\\StreamTeleporter' => $vendorDir . '/alchemy/zippy/src/Resource/Teleporter/StreamTeleporter.php',
    'Alchemy\\Zippy\\Resource\\Teleporter\\TeleporterInterface' => $vendorDir . '/alchemy/zippy/src/Resource/Teleporter/TeleporterInterface.php',
    'Alchemy\\Zippy\\Resource\\Writer\\FilesystemWriter' => $vendorDir . '/alchemy/zippy/src/Resource/Writer/FilesystemWriter.php',
    'Alchemy\\Zippy\\Resource\\Writer\\StreamWriter' => $vendorDir . '/alchemy/zippy/src/Resource/Writer/StreamWriter.php',
    'Alchemy\\Zippy\\Zippy' => $vendorDir . '/alchemy/zippy/src/Zippy.php',
    'Doctrine\\Common\\Collections\\AbstractLazyCollection' => $vendorDir . '/doctrine/collections/lib/Doctrine/Common/Collections/AbstractLazyCollection.php',
    'Doctrine\\Common\\Collections\\ArrayCollection' => $vendorDir . '/doctrine/collections/lib/Doctrine/Common/Collections/ArrayCollection.php',
    'Doctrine\\Common\\Collections\\Collection' => $vendorDir . '/doctrine/collections/lib/Doctrine/Common/Collections/Collection.php',
    'Doctrine\\Common\\Collections\\Criteria' => $vendorDir . '/doctrine/collections/lib/Doctrine/Common/Collections/Criteria.php',
    'Doctrine\\Common\\Collections\\Expr\\ClosureExpressionVisitor' => $vendorDir . '/doctrine/collections/lib/Doctrine/Common/Collections/Expr/ClosureExpressionVisitor.php',
    'Doctrine\\Common\\Collections\\Expr\\Comparison' => $vendorDir . '/doctrine/collections/lib/Doctrine/Common/Collections/Expr/Comparison.php',
    'Doctrine\\Common\\Collections\\Expr\\CompositeExpression' => $vendorDir . '/doctrine/collections/lib/Doctrine/Common/Collections/Expr/CompositeExpression.php',
    'Doctrine\\Common\\Collections\\Expr\\Expression' => $vendorDir . '/doctrine/collections/lib/Doctrine/Common/Collections/Expr/Expression.php',
    'Doctrine\\Common\\Collections\\Expr\\ExpressionVisitor' => $vendorDir . '/doctrine/collections/lib/Doctrine/Common/Collections/Expr/ExpressionVisitor.php',
    'Doctrine\\Common\\Collections\\Expr\\Value' => $vendorDir . '/doctrine/collections/lib/Doctrine/Common/Collections/Expr/Value.php',
    'Doctrine\\Common\\Collections\\ExpressionBuilder' => $vendorDir . '/doctrine/collections/lib/Doctrine/Common/Collections/ExpressionBuilder.php',
    'Doctrine\\Common\\Collections\\Selectable' => $vendorDir . '/doctrine/collections/lib/Doctrine/Common/Collections/Selectable.php',
    'Symfony\\Component\\Filesystem\\Exception\\ExceptionInterface' => $vendorDir . '/symfony/filesystem/Exception/ExceptionInterface.php',
    'Symfony\\Component\\Filesystem\\Exception\\FileNotFoundException' => $vendorDir . '/symfony/filesystem/Exception/FileNotFoundException.php',
    'Symfony\\Component\\Filesystem\\Exception\\IOException' => $vendorDir . '/symfony/filesystem/Exception/IOException.php',
    'Symfony\\Component\\Filesystem\\Exception\\IOExceptionInterface' => $vendorDir . '/symfony/filesystem/Exception/IOExceptionInterface.php',
    'Symfony\\Component\\Filesystem\\Filesystem' => $vendorDir . '/symfony/filesystem/Filesystem.php',
    'Symfony\\Component\\Filesystem\\LockHandler' => $vendorDir . '/symfony/filesystem/LockHandler.php',
    'Symfony\\Component\\Process\\Exception\\ExceptionInterface' => $vendorDir . '/symfony/process/Exception/ExceptionInterface.php',
    'Symfony\\Component\\Process\\Exception\\InvalidArgumentException' => $vendorDir . '/symfony/process/Exception/InvalidArgumentException.php',
    'Symfony\\Component\\Process\\Exception\\LogicException' => $vendorDir . '/symfony/process/Exception/LogicException.php',
    'Symfony\\Component\\Process\\Exception\\ProcessFailedException' => $vendorDir . '/symfony/process/Exception/ProcessFailedException.php',
    'Symfony\\Component\\Process\\Exception\\ProcessTimedOutException' => $vendorDir . '/symfony/process/Exception/ProcessTimedOutException.php',
    'Symfony\\Component\\Process\\Exception\\RuntimeException' => $vendorDir . '/symfony/process/Exception/RuntimeException.php',
    'Symfony\\Component\\Process\\ExecutableFinder' => $vendorDir . '/symfony/process/ExecutableFinder.php',
    'Symfony\\Component\\Process\\InputStream' => $vendorDir . '/symfony/process/InputStream.php',
    'Symfony\\Component\\Process\\PhpExecutableFinder' => $vendorDir . '/symfony/process/PhpExecutableFinder.php',
    'Symfony\\Component\\Process\\PhpProcess' => $vendorDir . '/symfony/process/PhpProcess.php',
    'Symfony\\Component\\Process\\Pipes\\AbstractPipes' => $vendorDir . '/symfony/process/Pipes/AbstractPipes.php',
    'Symfony\\Component\\Process\\Pipes\\PipesInterface' => $vendorDir . '/symfony/process/Pipes/PipesInterface.php',
    'Symfony\\Component\\Process\\Pipes\\UnixPipes' => $vendorDir . '/symfony/process/Pipes/UnixPipes.php',
    'Symfony\\Component\\Process\\Pipes\\WindowsPipes' => $vendorDir . '/symfony/process/Pipes/WindowsPipes.php',
    'Symfony\\Component\\Process\\Process' => $vendorDir . '/symfony/process/Process.php',
    'Symfony\\Component\\Process\\ProcessBuilder' => $vendorDir . '/symfony/process/ProcessBuilder.php',
    'Symfony\\Component\\Process\\ProcessUtils' => $vendorDir . '/symfony/process/ProcessUtils.php',
    'Symfony\\Polyfill\\Mbstring\\Mbstring' => $vendorDir . '/symfony/polyfill-mbstring/Mbstring.php',
);
